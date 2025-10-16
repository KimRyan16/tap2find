import express from "express";
import { studentHomePage } from "../controllers/studentController.js";

const router = express.Router();

// Student pages
router.get("/student", studentHomePage);

// Future student routes can be added here:
// router.get("/student/courses", coursesPage);
// router.get("/student/grades", gradesPage);
// router.get("/student/profile", profilePage);

export default router;
