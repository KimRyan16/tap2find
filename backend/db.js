// |= mongodb configuration local =|
// import mongoose from "mongoose";

// export const connectDB = async () => {
//   try {
//     await mongoose.connect("mongodb://127.0.0.1:27017/tap2find_db");
//     console.log("✅ MongoDB connected successfully!");
//   } catch (error) {
//     console.error("❌ MongoDB connection failed:", error.message);
//     process.exit(1);
//   }
// };


import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGO_URI;

if (!uri) {
  console.error("❌ MONGO_URI is missing in .env file");
  process.exit(1);
}

export const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export const connectDB = async () => {
  try {
    await client.connect();

    await client.db("admin").command({ ping: 1 });

    console.log("✅ Connected to MongoDB Atlas successfully!");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export const getDB = (dbName = "tap2find_db") => client.db(dbName);
