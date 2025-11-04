import { getDB } from "../../db.js";

// Get professors only
export const getProfessors = async (req, res) => {
  try {
    const db = getDB("tap2find_db");
    const users = db.collection("users");

    const list = await users
      .find(
        { $expr: { $eq: [ { $toLower: { $trim: { input: "$role" } } }, "professor" ] } },
        { projection: { password: 0, otp: 0, otpExpires: 0 } }
      )
      .sort({ _id: -1 })
      .limit(100)
      .toArray();

    return res.status(200).json({ success: true, professors: list });
  } catch (err) {
    console.error("Error fetching professors:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch professors" });
  }
};