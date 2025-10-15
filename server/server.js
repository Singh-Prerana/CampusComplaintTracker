import dotenv from "dotenv";
dotenv.config();


import express from 'express';
import cors from 'cors';
import morgan from "morgan";
import cookieParser from 'cookie-parser';
import connectDB from './config/database.js';
import authRoutes from './routes/auth.js';
import complaintRoutes from './routes/complaint.js';
import notificationRoutes from './routes/notification.js';
// import userRoutes from './routes/user.js';
import statsRoutes from './routes/stats.js';

connectDB();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));


app.get("/", (req, res) => res.json({ ok: true, message: "Campus Complaint Tracker API" }));
// app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/stats", statsRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
