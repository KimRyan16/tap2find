import express from "express";
import { professorDashboardPage } from "../controllers/professorController.js";

const router = express.Router();

// Professor pages
router.get("/professor", professorDashboardPage);

// Future professor routes can be added here:
// router.get("/professor/courses", coursesPage);
// router.get("/professor/students", studentsPage);
// router.get("/professor/grades", gradesPage);

export default router;
