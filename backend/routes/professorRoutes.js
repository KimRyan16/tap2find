import express from "express";
import { getAllProfessors } from "../controllers/professorController.js";

const router = express.Router();

// GET /api/professors
router.get("/", getAllProfessors);

export default router;
