// routes/userRouter.js

import express from "express";
import {
  getAllUsers,
  registerNewAdmin,
  updateAvatar,
} from "../controllers/userController.js";
import {
  isAuthenticated,
  isAuthorized,
} from "../middlewares/authMiddleware.js";
import { imageUpload } from "../middlewares/imageUpload.js";

const router = express.Router();

// ========== Admin: Register a New Admin ==========
router.post(
  "/add/new-Admin",
  isAuthenticated,
  isAuthorized("Admin"),
  imageUpload,
  registerNewAdmin
);

// ========== Admin: Get All Users ==========
router.get(
  "/all",
  isAuthenticated,
  isAuthorized("Admin"),
  getAllUsers
);

// ========== User: Update Avatar ==========
router.put(
  "/update-avatar",
  isAuthenticated,
  imageUpload,
  updateAvatar
);

export default router;
