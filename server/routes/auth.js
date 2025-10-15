import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";

import { body, validationResult } from "express-validator";
import User from "../models/User.js";
import upload from "../middleware/upload.js"; // <-- Cloudinary upload middleware
import sendEmail from "../utils/sendEmail.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Helpers
const issueTokens = async (user, res) => {
  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id);
  user.refreshToken = refreshToken;
  await user.save();
  return { accessToken, refreshToken, role: user.role };
};

// ✅ Signup with avatar upload to Cloudinary
router.post(
  "/signup",
  upload.single("avatar"), // parse avatar file (optional)
  body("name").notEmpty(),
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }

    try {
      const { name, email, password, role, rollNo, staffId } = req.body;

      // Check if user already exists
      const exists = await User.findOne({ email });
      if (exists) return res.status(409).json({ msg: "User already exists" });

      // Hash password
      const hash = await bcrypt.hash(password, 10);

      // Cloudinary will give `req.file.path` as the secure URL
      const avatarUrl = req.file ? req.file.path : null;

      // Create user
      const user = await User.create({
        name,
        email,
        password: hash,
        role,
        rollNo,
        staffId,
        avatar: avatarUrl, // store Cloudinary URL in DB
      });

      // Issue tokens
      const tokens = await issueTokens(user, res);
      res.status(201).json(tokens);
    } catch (e) {
      console.error("Signup error:", e);
      console.error("Signup error:", e.message);
      console.error(e.stack);
      res.status(500).json({ msg: "Server error" });
    }
  }
);

// Login
router.post(
  "/login",
  body("email").isEmail(),
  body("password").notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ msg: "Invalid credentials" });

      const ok = await bcrypt.compare(password, user.password);
      if (!ok) return res.status(400).json({ msg: "Invalid credentials" });

      // issue tokens
      const tokens = await issueTokens(user, res);

      // ✅ Send response back to frontend
      res.json({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        role: user.role,
      });
    } catch (error) {
      res.status(500).json({ msg: "Server error" });
    }
  }
);

// Refresh

router.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(400).json({ msg: "Missing refresh token" });
    const user = await User.findOne({ refreshToken });
    if (!user) return res.status(401).json({ msg: "Invalid refresh token" });

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const accessToken = generateAccessToken(user._id, user.role);
    res.json({ accessToken });
  } catch (error) {
    res.status(401).json({ msg: "Invalid/expired refresh token" });
  }
});

// Logout
router.post("/logout", protect, async (req, res) => {
  try {
    req.user.refreshToken = null;
    await req.user.save();
    res.json({
      msg: "Logged Out",
    });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Me
router.get("/me", protect, async (req, res) => {
  res.json(req.user);
});

// Update profile

router.put("/profile", protect, upload.single("avatar"), async (req, res) => {
  try {
    const updates = {
      name: req.body.name ?? req.user.name,
      rollNo: req.body.rollNo ?? req.user.rollNo,
      email: req.user.email, // email is read-only
    };

    if (req.file && req.file.path) {
      updates.avatarUrl = `/${req.file.path}`; // ✅ store URL
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
    }).select("-password");

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});

// Change password
router.post(
  "/change-password",
  protect,
  body("currentPassword").notEmpty(),
  body("newPassword").isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    try {
      const { currentPassword, newPassword } = req.body;
      const ok = await bcrypt.compare(currentPassword, req.user.password);
      if (!ok)
        return res.status(400).json({ msg: "Current password incorrect" });
      req.user.password = await bcrypt.hash(newPassword, 10);
      await req.user.save();
      res.json({ msg: "Password updated" });
    } catch (error) {
      res.status(500).json({ msg: "Server error" });
    }
  }
);

// Forgot password

router.post(
  "/forgot-password",
  body("email").isEmail(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      // Don’t reveal account existence
      return res.status(200).json({ msg: "If account exists, email sent" });

    // Generate a 6-digit code and hash it before saving
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashed = crypto.createHash("sha256").update(otp).digest("hex");

    user.otpCode = hashed;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    await sendEmail({
      to: email,
      subject: "Password Reset OTP",
      html: `<p>Your OTP is <b>${otp}</b>. It expires in 10 minutes.</p>`
    });

    res.json({ msg: "OTP sent to email if account exists" });
  }
);
// VERIFY OTP
 router.post(
  "/verify-otp",
  body("email").isEmail(),
  body("otp").notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { email, otp } = req.body;
    const user = await User.findOne({
      email,
      otpExpires: { $gt: Date.now() }
    });
    if (!user) return res.status(400).json({ msg: "OTP invalid or expired" });

    const hashed = crypto.createHash("sha256").update(otp).digest("hex");
    if (hashed !== user.otpCode)
      return res.status(400).json({ msg: "OTP invalid or expired" });

    // ✅ Clear OTP so it can’t be reused
    user.otpCode = undefined;
    await user.save();

    // Instead of a JWT for normal auth, issue a short-lived reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 min
    await user.save();

    res.json({ msg: "OTP verified", resetToken });
  }
);


// Reset password


router.post(
  "/reset-password",
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: "User not found" });
      }

      // ✅ OPTIONAL: If you store otp + expiry in DB,
      // check that OTP has been verified or hasn't expired
      // e.g. if (!user.otpVerified) return res.status(400).json({ msg: "OTP not verified" });

      user.password = await bcrypt.hash(password, 10);

      // clear any otp fields if you use them
      user.otp = undefined;
      user.otpExpires = undefined;

      await user.save();
      res.json({ msg: "Password has been reset" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Server error" });
    }
  }
);


export default router;
