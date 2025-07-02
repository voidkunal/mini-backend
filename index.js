// backend/index.js

import dotenv from "dotenv";
dotenv.config(); // Load env vars FIRST

import { connectDB } from "./database/db.js";
import { v2 as cloudinary } from "cloudinary";
import { app } from "./app.js";

// ✅ Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
  api_key: process.env.CLOUDINARY_CLIENT_API,
  api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
  secure: true,
});

// ✅ Start Server
const startServer = async () => {
  try {
    await connectDB();

    const port = process.env.PORT || 4000;

    app.listen(port, () => {
      console.log(`🚀 Server is running at http://localhost:${port}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
};

startServer();
