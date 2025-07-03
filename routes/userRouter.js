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


router.post(
  "/add/new-Admin",
  isAuthenticated,
  isAuthorized("Admin"),
  imageUpload,
  registerNewAdmin
);


router.get(
  "/all",
  isAuthenticated,
  isAuthorized("Admin"),
  getAllUsers
);


router.put(
  "/update-avatar",
  isAuthenticated,
  imageUpload,
  updateAvatar
);

export default router;
