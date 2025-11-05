import { getDB } from "../db.js";

export const getAllProfessors = async (req, res) => {
  try {
    const db = getDB();

    const professors = await db.collection("users")
      .find({ role: "professor" })
      .project({
        firstName: 1,
        lastName: 1,
        department: 1,
        facultyPosition: 1,
        office: 1,
        status: 1,
        emailAddress: 1,
      })
      .toArray();

    const formatted = professors.map(p => ({
      id: p._id.toString(),
      name: `${p.firstName} ${p.lastName}`,
      department: p.department || "Unknown Department",
      office: p.office || "No office assigned",
      email: p.emailAddress,
      available: p.status ? p.status.toLowerCase() : "not-available"
    }));

    res.status(200).json({ success: true, professors: formatted });

  } catch (error) {
    console.error("Error fetching professors:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
