// routes/stats.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import Complaint from "../models/Complaint.js";

const router = express.Router();

/**
 * GET /api/stats/overview
 * Returns key metrics for admin dashboard
 */
router.get("/overview", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const [
      totalComplaints,
      resolvedComplaints,
      pendingComplaints,
      inProgressComplaints,
      totalUsers,
      activeUsers
    ] = await Promise.all([
      Complaint.countDocuments(),
      Complaint.countDocuments({ status: "Resolved" }),
      Complaint.countDocuments({ status: "Pending" }),
      Complaint.countDocuments({ status: "In-Progress" }),
      User.countDocuments(),
      User.countDocuments({ isBanned: { $ne: true } })
    ]);

    res.json({
      totalComplaints,
      resolvedComplaints,
      pendingComplaints,
      inProgressComplaints,
      totalUsers,
      activeUsers
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
