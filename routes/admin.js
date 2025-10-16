import express from "express";
import { dashboardPage } from "../controllers/authController.js";

const router = express.Router();

// Admin pages
router.get("/admin", dashboardPage);

// Future admin routes can be added here:
// router.get("/admin/users", usersPage);
// router.get("/admin/settings", settingsPage);
// router.get("/admin/reports", reportsPage);

export default router;
