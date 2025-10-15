import express from "express";
import { body, validationResult } from "express-validator";
import Complaint from "../models/Complaint.js";
import upload from "../middleware/upload.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";
import Notification from "../models/Notification.js";

const router = express.Router();
//  Create complaint with multiple attachments

router.post(
    "/",
    protect,
    upload.array("attachments", 5),
    body("title").notEmpty(),
    body("description").notEmpty(),
    body("category").isIn([
    "Hostel",
    "Classroom",
    "Mess",
    "Wifi",
    "Library",
    "Academics",
    "IT",
    "Facilities",
    "Other",
    ]),
    async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    try {
      const attachments = (req.files || []).map((f) => f.path);
      const complaint = await Complaint.create({
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        attachments,
        createdBy: req.user._id,
      });
      res.status(201).json(complaint);
    } catch (e) {
      res.status(500).json({ msg: "Server error" });
    }
  }
)

// List complaints with filters

router.get("/", protect, async (req, res) => {
    try {
        const { status, category, mine } = req.query;
        const q = {};
        if (status) q.status = status;
        if (category) q.category = category;
        if (mine == "true") q.createdBy = req.user._id;
        const items = await Complaint.find(q)
            .populate("createdBy", "name email role")
            .sort({ createdAt: -1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ msg: "Server error" });
    }
});

// Update status (admin only)
// PUT /api/complaints/:id/status
router.put("/:id/status", protect, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Find the complaint
    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // Only admin can update
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Update status
    complaint.status = status;
    await complaint.save();

    // ✅ Safely create a notification if we have a valid user ObjectId
    const userId = complaint.user || complaint.createdBy; // handle whichever field you actually use
    if (userId) {
      try {
        await Notification.create({
          user: userId,
          title: "Complaint Status Updated",
          message: `Your complaint "${complaint.title}" status has been changed to ${status}.`,
          read: false,
        });
      } catch (notifyErr) {
        console.error("Notification error:", notifyErr.message);
        // Don’t crash if notification fails
      }
    }

    return res.json({ message: "Status updated successfully", complaint });
  } catch (err) {
    console.error("Status update error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
});

// router.put("/:id/status", protect, async (req, res) => {
  
//   try {
//     const complaint = await Complaint.findById(req.params.id);

//     if (!complaint) {
//       return res.status(404).json({ message: "Complaint not found" });
//     }

//     // Only admin should update
//     if (req.user.role !== "admin") {
//       return res.status(403).json({ message: "Not authorized" });
//     }

//     complaint.status = req.body.status;
//     await complaint.save();
    

//     // 🔔 Create a notification for the complaint's student
//     // await Notification.create({
//     //   user: complaint.user, // the student who filed the complaint
//     //   title: "Complaint Status Updated",
//     //   message: `Your complaint "${complaint.title}" status has been changed to ${req.body.status}.`,
//     //   read: false,
//     // });
  
//     res.json(complaint);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// Assign to staff(admin)
router.patch(
  "/:id/assign",
  protect,
  requireRole("admin"),
  body("userId").notEmpty(),
  async (req, res) => {
    try {
      const updated = await Complaint.findByIdAndUpdate(
        req.params.id,
        { assignedTo: req.body.userId },
        { new: true }
      );
      if (!updated) return res.status(404).json({ msg: "Complaint not found" });
      res.json(updated);
    } catch (e) {
      res.status(500).json({ msg: "Server error" });
    }
  }
);
/**
 * GET /api/complaints/all
 * Accessible by any authenticated user
 * Returns all complaints from all users
 */
router.get("/all", protect, async (req, res) => {
  try {
    // Optional: add query filter for search/category if needed
    const complaints = await Complaint.find()
      .populate("createdBy", "name email role") // show user info
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch complaints" });
  }
});


export default router;
