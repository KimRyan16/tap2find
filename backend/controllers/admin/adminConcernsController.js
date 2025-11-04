import { getDB } from "../../db.js";

// Get recent concerns
export const getConcerns = async (req, res) => {
  try {
    const db = getDB("tap2find_db");
    const concerns = db.collection("concerns");

    const list = await concerns
      .find({})
      .sort({ createdAt: -1, timestamp: -1, _id: -1 })
      .limit(100)
      .toArray();

    return res.status(200).json({ success: true, concerns: list });
  } catch (err) {
    console.error("Error fetching concerns:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch concerns" });
  }
};