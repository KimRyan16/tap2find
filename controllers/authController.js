
import bcrypt from "bcrypt";
import { User } from "../models/userModel.js";

export const loginPage = (req, res) => res.render("auth/login", { 
  title: "Login", 
  pageTitle: "Login" 
});
export const registerPage = (req, res) => res.render("auth/register", { 
  title: "Register", 
  pageTitle: "Create Account" 
});
export const forgotPasswordPage = (req, res) => res.render("auth/forgotpassword", { 
  title: "Forgot Password", 
  pageTitle: "Reset Password" 
});
export const verifyEmailPage = (req, res) => res.render("auth/verify-email", { 
  title: "Verify Email", 
  pageTitle: "Email Verification" 
});
export const dashboardPage = (req, res) => {
  // Authentication check removed for frontend development
  res.render("admin/dashboard", { title: "Dashboard" });
};

export const loginUser = async (req, res) => {
  // Authentication logic removed for frontend development
  // Just redirect to admin for now
  res.redirect("/admin");
};

export const registerUser = async (req, res) => {
  // Registration logic removed for frontend development
  // Just redirect to admin for now
  res.redirect("/admin");
};

export const logoutUser = (req, res) => {
  req.session.destroy();
  res.redirect("/login");
};
