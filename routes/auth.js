import express from "express";
import { 
  loginPage, 
  registerPage, 
  forgotPasswordPage, 
  verifyEmailPage,
  loginUser, 
  registerUser, 
  logoutUser 
} from "../controllers/authController.js";

const router = express.Router();

// Auth pages
router.get("/login", loginPage);
router.get("/register", registerPage);
router.get("/forgot-password", forgotPasswordPage);
router.get("/verify-email", verifyEmailPage);

// Auth actions
router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/logout", logoutUser);

export default router;
