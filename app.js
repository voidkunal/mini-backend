// backend/app.js

import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";

import authRouter from "./routes/authRouter.js";
import bookRouter from "./routes/bookRouter.js";
import borrowRouter from "./routes/borrowRouter.js";
import userRouter from "./routes/userRouter.js";
import { errorMiddleware } from "./middlewares/errorMiddlewares.js";
import { notifyUsers } from "./services/notifyUsers.js";
import { removeUnverifiedAccounts } from "./services/removeUnverifiedAccounts.js";

// Setup __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
config({ path: "./config/config.env" });

// Create app
export const app = express();

// ✅ CORS config for local and production
app.use(cors({
  origin: [process.env.FRONTEND_URL, "http://localhost:5173"], // ✅ supports local & vercel
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

// ✅ Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Static file serving
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ API Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/book", bookRouter);
app.use("/api/v1/borrow", borrowRouter);
app.use("/api/v1/user", userRouter);

// ✅ 404 Handler
app.all("*", (req, res) => {
  res.status(404).json({ success: false, message: "API route not found" });
});

// ✅ Multer error handler
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ success: false, message: err.message });
  }
  next(err);
});

// ✅ Global error handler
app.use(errorMiddleware);

// ✅ Background tasks
notifyUsers();
removeUnverifiedAccounts();
