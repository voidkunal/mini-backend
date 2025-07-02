// routes/bookRouter.js

import express from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/fileUpload.js";
import {
  addBook,
  getAllBooks,
  deleteBook,
} from "../controllers/bookController.js";

const router = express.Router();

// ========== Admin: Add Book ==========
router.post(
  "/admin/add",
  isAuthenticated,
  isAuthorized("Admin"),
  upload.single("file"),
  addBook
);

// ========== User: Get All Books ==========
router.get("/all", isAuthenticated, getAllBooks);

// ========== Admin: Delete Book ==========
router.delete(
  "/delete/:id",
  isAuthenticated,
  isAuthorized("Admin"),
  deleteBook
);

export default router;
