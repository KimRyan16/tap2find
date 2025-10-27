import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { User } from "../models/userModel.js";

// 📧 Setup email transporter (use App Password if Gmail)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // use SSL
  auth: {
    user: "perjescykean35@gmail.com",
    pass: "tvuo wqip iyxs jens",
  },
});

// 📌 Generate a random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// 🧩 Register User and send OTP
export const registerUser = async (req, res) => {
  try {
    const { role, emailAddress, password, firstName, lastName, idNumber, contactNumber, facultyPosition } = req.body;

    const existingUser = await User.findOne({ emailAddress });
    if (existingUser) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpires = Date.now() + 5 * 60 * 1000; // expires in 10 mins

    const user = new User({
      role,
      emailAddress,
      password: hashedPassword,
      firstName,
      lastName,
      idNumber,
      contactNumber,
      facultyPosition,
      otp,
      otpExpires,
      isVerified: false
    });

    await user.save();

    // ✉️ Send OTP Email
    await transporter.sendMail({
      from: `"Tap2Find Authentication" <${process.env.EMAIL_USER}>`,
      to: emailAddress,
      subject: "Your Tap2Find Verification Code",
      html: `
        <h2>Welcome to Tap2Find</h2>
        <p>Your email verification code is:</p>
        <h1>${otp}</h1>
        <p>This code will expire in <b>5 minutes</b>.</p>
      `
    });

    res.status(201).json({
      message: "User registered successfully. Please check your email for the OTP verification code."
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 🧾 Verify OTP
export const verifyOTP = async (req, res) => {
  try {
    const { emailAddress, otp } = req.body;

    const user = await User.findOne({ emailAddress });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isVerified) return res.status(400).json({ message: "User already verified" });

    if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
    if (Date.now() > user.otpExpires) return res.status(400).json({ message: "OTP expired" });

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.status(200).json({ message: "Email verified successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 🔁 RESEND OTP
export const resendOTP = async (req, res) => {
  try {
    const { emailAddress } = req.body;

    const user = await User.findOne({ emailAddress });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isVerified)
      return res.status(400).json({ message: "User already verified" });

    const newOTP = generateOTP();
    const newExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes

    user.otp = newOTP;
    user.otpExpires = newExpiry;
    await user.save();

    // ✉️ Send new OTP
    await transporter.sendMail({
      from: `"Tap2Find Authentication" <${process.env.EMAIL_USER}>`,
      to: emailAddress,
      subject: "Your new Tap2Find verification code",
      html: `
        <h2>Resent Verification Code</h2>
        <p>Your new email verification code is:</p>
        <h1>${newOTP}</h1>
        <p>This code will expire in <b>5 minutes</b>.</p>
      `
    });

    res.status(200).json({ message: "New OTP sent successfully!" });
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 🔐 Login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔍 Find user by email
    const user = await User.findOne({ emailAddress: email });
    if (!user)
      return res.status(404).json({
        success: false,
        message: "User not found",
      });

    // 🔒 Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });

    // 🚫 Check if verified
    if (!user.isVerified)
      return res.status(403).json({
        success: false,
        message: "Your email is not verified. Please verify it before logging in.",
      });

    // 🎟️ Create JWT Token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // ✅ Send back
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        role: user.role,
        emailAddress: user.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// 🧾 Request password reset
export const requestPasswordReset = async (req, res) => {
  try {
    const { email, emailAddress } = req.body;
    const targetEmail = email || emailAddress;

    const user = await User.findOne({ emailAddress: targetEmail });
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    await transporter.sendMail({
      from: `"Tap2Find Support" <${process.env.EMAIL_USER}>`,
      to: targetEmail,
      subject: "Password Reset Request",
      html: `
        <h2>Password Reset Request</h2>
        <p>Hello ${user.firstName || "User"},</p>
        <p>You requested to reset your password. Click the link below to proceed:</p>
        <a href="${resetLink}" style="background-color:#22c55e;color:#fff;padding:10px 20px;text-decoration:none;border-radius:5px;">Reset Password</a>
        <p>This link will expire in 10 minutes.</p>
      `,
    });

    res.status(200).json({
      success: true,
      message: "Password reset email sent. Please check your inbox.",
    });
  } catch (error) {
    console.error("Reset email error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send reset email.",
      error: error.message,
    });
  }
};

// Reset password endpoint
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully.",
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(400).json({
        success: false,
        message: "Reset token expired. Please request a new link.",
      });
    }

    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reset password.",
      error: error.message,
    });
  }
};
