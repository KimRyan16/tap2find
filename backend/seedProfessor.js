// seedProfessors.js
import { connectDB, getDB } from "./db.js";
import dotenv from "dotenv";

dotenv.config();

const professors = [
  {
    role: "professor",
    emailAddress: "john.doe@university.edu",
    password: "hashedpassword123",
    firstName: "John",
    middleName: "M",
    lastName: "Doe",
    idNumber: "P001",
    contactNumber: "09171234567",
    facultyPosition: "Assistant Professor",
    program: "",
    yearLevel: "",
    section: "",
    avatarUrl: "",
    coverUrl: "",
    otp: null,
    otpExpires: null,
    isVerified: true,
    status: "Available",
  },
  {
    role: "professor",
    emailAddress: "jane.smith@university.edu",
    password: "hashedpassword123",
    firstName: "Jane",
    middleName: "A",
    lastName: "Smith",
    idNumber: "P002",
    contactNumber: "09181112222",
    facultyPosition: "Professor II",
    program: "",
    yearLevel: "",
    section: "",
    avatarUrl: "",
    coverUrl: "",
    otp: null,
    otpExpires: null,
    isVerified: true,
    status: "Busy",
  },
  {
    role: "professor",
    emailAddress: "michael.torres@university.edu",
    password: "hashedpassword123",
    firstName: "Michael",
    middleName: "R",
    lastName: "Torres",
    idNumber: "P003",
    contactNumber: "09193334444",
    facultyPosition: "Instructor I",
    program: "",
    yearLevel: "",
    section: "",
    avatarUrl: "",
    coverUrl: "",
    otp: null,
    otpExpires: null,
    isVerified: true,
    status: "Not Available",
  },
];

const insertProfessors = async () => {
  await connectDB(process.env.MONGO_URI);
  const db = getDB();
  await db.collection("users").insertMany(professors);
  console.log("✅ Inserted sample professors successfully!");
  process.exit();
};

insertProfessors();
