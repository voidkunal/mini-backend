// index.js

import dotenv from "dotenv";
dotenv.config(); // Load env vars FIRST

import { connectDB } from "./database/db.js";
import { v2 as cloudinary } from "cloudinary";
import { app } from "./app.js";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
  api_key: process.env.CLOUDINARY_CLIENT_API,
  api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
  secure: true,
});

// Connect to DB and then start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${process.env.PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
};

startServer();
