import express from "express";
import landingRoutes from "./landing.js";
import authRoutes from "./auth.js";
import adminRoutes from "./admin.js";
import professorRoutes from "./professor.js";
import studentRoutes from "./student.js";

const router = express.Router();

// Landing routes
router.use("/", landingRoutes);

// Auth routes
router.use("/", authRoutes);

// Admin routes
router.use("/", adminRoutes);

// Professor routes
router.use("/", professorRoutes);

// Student routes
router.use("/", studentRoutes);

export default router;
