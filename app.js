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

// Setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();
config({ path: "./config/config.env" });

app.set("trust proxy", 1); // ✅ TRUST RENDER'S PROXY TO SET SECURE COOKIES

app.use(cors({
  origin: "https://mini-frontend-green.vercel.app",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/book", bookRouter);
app.use("/api/v1/borrow", borrowRouter);
app.use("/api/v1/user", userRouter);

app.all("*", (req, res) => {
  res.status(404).json({ success: false, message: "API route not found" });
});

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ success: false, message: err.message });
  }
  next(err);
});

app.use(errorMiddleware);

notifyUsers();
removeUnverifiedAccounts();
