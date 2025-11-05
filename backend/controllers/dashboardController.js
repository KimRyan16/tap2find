// controllers/dashboardController.js
import { getDB } from "../db.js";

export const getStudentDashboard = async (req, res) => {
  try {
    const db = getDB();

    // Get student ID from authentication or query
    const studentId = req.user?.id || req.query.studentId;
    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: "Missing student ID",
      });
    }

    // 1️⃣ Professor Status Statistics
    const professorStats = await db.collection("users")
      .aggregate([
        { $match: { role: "professor" } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ])
      .toArray();

    const stats = {
      available: professorStats.find((s) => s._id === "Available")?.count || 0,
      busy: professorStats.find((s) => s._id === "Busy")?.count || 0,
      notAvailable: professorStats.find((s) => s._id === "Not Available")?.count || 0,
    };

    // 2️⃣ Professor Availability Trend Chart
    const availabilityTrend = await db.collection("professor_status_logs")
      .aggregate([
        {
          $group: {
            _id: {
              date: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
              status: "$status",
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.date": 1 } },
      ])
      .toArray();

    // Build chart data
    const groupedByDate = {};
    for (const entry of availabilityTrend) {
      const { date, status } = entry._id;
      if (!groupedByDate[date])
        groupedByDate[date] = { date, available: 0, busy: 0, notAvailable: 0 };

      if (status === "Available") groupedByDate[date].available += entry.count;
      else if (status === "Busy") groupedByDate[date].busy += entry.count;
      else if (status === "Not Available")
        groupedByDate[date].notAvailable += entry.count;
    }

    const chartData = Object.values(groupedByDate);

    // 3️⃣ Student Inquiries Data
    const studentInquiries = await db.collection("inquiries")
      .find({ studentId })
      .sort({ dateSent: -1 })
      .toArray();

    const inquiriesSentCount = studentInquiries.length;

    // 4️⃣ Recent Inquiries
    const recentInquiries = studentInquiries.slice(0, 5).map((i) => ({
      id: i._id,
      professor: i.professorInfo || null, // handle missing data gracefully
      subject: i.subject,
      message: i.message,
      status: i.status,
      dateRelative: new Date(i.dateSent).toLocaleDateString(),
      dateExact: new Date(i.dateSent).toLocaleString(),
      responseTime: i.responseTime || null,
    }));

    // ✅ Final Response
    res.status(200).json({
      success: true,
      data: {
        stats,
        chartData,
        inquiriesSentCount,
        recentInquiries,
      },
    });
  } catch (error) {
    console.error("Dashboard controller error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
