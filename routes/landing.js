import express from "express";
import { homePage } from "../controllers/homeController.js";

const router = express.Router();

// Landing pages
router.get("/", homePage);

// Future landing routes can be added here:
// router.get("/about", aboutPage);
// router.get("/contact", contactPage);
// router.get("/features", featuresPage);

export default router;
