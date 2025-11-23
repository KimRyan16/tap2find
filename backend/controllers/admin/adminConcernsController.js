import { getDB } from "../../db.js";
import { ObjectId } from "mongodb";

// Get concerns list with optional filters
export const getConcerns = async (req, res) => {
  try {
    const db = getDB("tap2find_db");
    const concerns = db.collection("inquiries");

    const { professorId, studentId, status } = req.query;
    const filter = {};
    if (professorId && ObjectId.isValid(professorId)) filter.professorId = new ObjectId(professorId);
    if (studentId && ObjectId.isValid(studentId)) filter.studentId = new ObjectId(studentId);
    if (status) filter.status = String(status);

    const list = await concerns
      .find(filter)
      .sort({ createdAt: -1, timestamp: -1, _id: -1 })
      .limit(100)
      .toArray();

    // Enrich with student/professor names
    const userIds = [];
    for (const c of list) {
      if (c.studentId) userIds.push(c.studentId);
      if (c.professorId) userIds.push(c.professorId);
    }
    const uniqStrings = [...new Set(userIds.map((x) => (x ? x.toString() : null)).filter(Boolean))];
    const uniq = uniqStrings.filter((s) => ObjectId.isValid(s)).map((s) => new ObjectId(s));
    if (uniq.length) {
      const users = await getDB("tap2find_db").collection("users")
        .find({ _id: { $in: uniq } }, { projection: { firstName: 1, lastName: 1, role: 1, emailAddress: 1, idNumber: 1 } })
        .toArray();
      const map = new Map(users.map(u => [u._id.toString(), u]));
      for (const c of list) {
        const stu = c.studentId ? map.get(c.studentId.toString()) : null;
        const prof = c.professorId ? map.get(c.professorId.toString()) : null;
        if (stu && !c.studentName) c.studentName = `${stu.firstName || ''} ${stu.lastName || ''}`.trim();
        if (prof && !c.professorName) c.professorName = `${prof.firstName || ''} ${prof.lastName || ''}`.trim();
      }
    }

    // Extra enrichment: when professorId is not an ObjectId (e.g., email or idNumber), try to resolve
    try {
      const usersColl = getDB("tap2find_db").collection("users");
      for (const c of list) {
        if (!c.professorName) {
          // If backend already stored a plain string professor name/label
          if (typeof c.professor === 'string' && c.professor.trim()) {
            c.professorName = c.professor.trim();
            continue;
          }
          if (typeof c.faculty === 'string' && c.faculty.trim()) {
            c.professorName = c.faculty.trim();
            continue;
          }
          const pid = c.professorId;
          if (pid && typeof pid === 'string') {
            // Try by email first
            let profDoc = await usersColl.findOne({ emailAddress: pid }, { projection: { firstName: 1, lastName: 1, role: 1 } });
            // Try by RFID/id number if not found
            if (!profDoc) {
              profDoc = await usersColl.findOne({ idNumber: pid.toUpperCase().trim() }, { projection: { firstName: 1, lastName: 1, role: 1 } });
            }
            // Try if string is actually a valid ObjectId but not passed earlier
            if (!profDoc && ObjectId.isValid(pid)) {
              profDoc = await usersColl.findOne({ _id: new ObjectId(pid) }, { projection: { firstName: 1, lastName: 1, role: 1 } });
            }
            if (profDoc) {
              c.professorName = `${profDoc.firstName || ''} ${profDoc.lastName || ''}`.trim();
            }
          }
        }
        if (!c.studentName) {
          const sid = c.studentId;
          if (sid && typeof sid === 'string') {
            let stuDoc = await usersColl.findOne({ emailAddress: sid }, { projection: { firstName: 1, lastName: 1 } });
            if (!stuDoc) {
              stuDoc = await usersColl.findOne({ idNumber: sid.toUpperCase().trim() }, { projection: { firstName: 1, lastName: 1 } });
            }
            if (!stuDoc && ObjectId.isValid(sid)) {
              stuDoc = await usersColl.findOne({ _id: new ObjectId(sid) }, { projection: { firstName: 1, lastName: 1 } });
            }
            if (stuDoc) {
              c.studentName = `${stuDoc.firstName || ''} ${stuDoc.lastName || ''}`.trim();
            }
          }
        }
      }
    } catch (enrichErr) {
      console.warn('Concerns enrichment fallback failed:', enrichErr?.message || enrichErr);
    }

    return res.status(200).json({ success: true, concerns: list });
  } catch (err) {
    console.error("Error fetching concerns:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch concerns" });
  }
};

// Get a single concern by _id
export const getConcernById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).json({ success: false, message: "Invalid id" });
    const db = getDB("tap2find_db");
    const concerns = db.collection("inquiries");

    const doc = await concerns.findOne({ _id: new ObjectId(id) });
    if (!doc) return res.status(404).json({ success: false, message: "Concern not found" });

    // Enrich with names
    const usersColl = getDB("tap2find_db").collection("users");
    // Handle both string and ObjectId forms safely
    // Student
    if (!doc.studentName) {
      const sidAny = doc.studentId;
      let stu = null;
      if (sidAny && typeof sidAny === 'string') {
        if (ObjectId.isValid(sidAny)) {
          stu = await usersColl.findOne({ _id: new ObjectId(sidAny) }, { projection: { firstName: 1, lastName: 1 } });
        }
        if (!stu) {
          stu = await usersColl.findOne({ emailAddress: sidAny }, { projection: { firstName: 1, lastName: 1 } });
        }
        if (!stu) {
          stu = await usersColl.findOne({ idNumber: sidAny.toUpperCase().trim() }, { projection: { firstName: 1, lastName: 1 } });
        }
      } else if (sidAny && typeof sidAny === 'object') {
        stu = await usersColl.findOne({ _id: sidAny }, { projection: { firstName: 1, lastName: 1 } });
      }
      if (stu) doc.studentName = `${stu.firstName || ''} ${stu.lastName || ''}`.trim();
    }

    // Professor
    if (!doc.professorName) {
      const pidAny = doc.professorId;
      let prof = null;
      if (pidAny && typeof pidAny === 'string') {
        if (ObjectId.isValid(pidAny)) {
          prof = await usersColl.findOne({ _id: new ObjectId(pidAny) }, { projection: { firstName: 1, lastName: 1 } });
        }
        if (!prof) {
          prof = await usersColl.findOne({ emailAddress: pidAny }, { projection: { firstName: 1, lastName: 1 } });
        }
        if (!prof) {
          prof = await usersColl.findOne({ idNumber: pidAny.toUpperCase().trim() }, { projection: { firstName: 1, lastName: 1 } });
        }
      } else if (pidAny && typeof pidAny === 'object') {
        prof = await usersColl.findOne({ _id: pidAny }, { projection: { firstName: 1, lastName: 1 } });
      }
      if (prof) doc.professorName = `${prof.firstName || ''} ${prof.lastName || ''}`.trim();
      // fallback to plain string fields if present
      if (!doc.professorName && typeof doc.professor === 'string') doc.professorName = doc.professor.trim();
      if (!doc.professorName && typeof doc.faculty === 'string') doc.professorName = doc.faculty.trim();
    }

    return res.status(200).json({ success: true, concern: doc });
  } catch (err) {
    console.error("Error fetching concern:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch concern" });
  }
};

// Update concern status: allow only 'pending' or 'resolved'
export const updateConcernStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body || {};
    if (!ObjectId.isValid(id)) return res.status(400).json({ success: false, message: "Invalid id" });
    const allowed = ["pending", "resolved"];
    if (!allowed.includes(String(status))) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }
    const db = getDB("tap2find_db");
    const concerns = db.collection("inquiries");
    const result = await concerns.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: String(status), updatedAt: new Date() } }
    );
    if (result.matchedCount === 0) return res.status(404).json({ success: false, message: "Concern not found" });
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error updating concern status:", err);
    return res.status(500).json({ success: false, message: "Failed to update concern status" });
  }
};

// Archive a concern (set status = 'archived')
export const archiveConcern = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).json({ success: false, message: "Invalid id" });
    const db = getDB("tap2find_db");
    const concerns = db.collection("inquiries");
    const result = await concerns.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: "archived", updatedAt: new Date() } }
    );
    if (result.matchedCount === 0) return res.status(404).json({ success: false, message: "Concern not found" });
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error archiving concern:", err);
    return res.status(500).json({ success: false, message: "Failed to archive concern" });
  }
};

// Delete a concern
export const deleteConcern = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).json({ success: false, message: "Invalid id" });
    const db = getDB("tap2find_db");
    const concerns = db.collection("inquiries");
    const result = await concerns.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return res.status(404).json({ success: false, message: "Concern not found" });
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error deleting concern:", err);
    return res.status(500).json({ success: false, message: "Failed to delete concern" });
  }
};