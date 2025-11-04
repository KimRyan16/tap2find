import express from "express";
import { getDashboardStats } from "../controllers/admin/adminDashboardController.js";
import { getUsers, getUserById, updateUser, deleteUser } from "../controllers/admin/adminUsersController.js";
import { getProfessors } from "../controllers/admin/adminProfessorController.js";
import { getConcerns } from "../controllers/admin/adminConcernsController.js";
import { getReportsSummary } from "../controllers/admin/adminReportController.js";

const router = express.Router();

// Dashboard
router.get("/dashboard", getDashboardStats);
router.get("/stats", getDashboardStats); // alias

// Users
router.get("/users", getUsers);
router.get("/users/:id", getUserById);
router.patch("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

// Professors
router.get("/professors", getProfessors);

// Concerns
router.get("/concerns", getConcerns);

// Reports
router.get("/reports/summary", getReportsSummary);

export default router;