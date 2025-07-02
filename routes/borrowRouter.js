// routes/borrowRouter.js

import express from "express";
import {
  recordBorrowedBook,
  borrowedBooks,
  getBorrowedBooksForAdmin,
  returnBorrowBook,
} from "../controllers/borrowController.js";
import {
  isAuthenticated,
  isAuthorized,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// ========== Admin/User: Record a Borrow ==========
router.post(
  "/record-borrow-book/:id",
  isAuthenticated,
  isAuthorized("Admin", "user"),
  recordBorrowedBook
);

// ========== Admin: View All Borrowed Books ==========
router.get(
  "/borrowed-books-users",
  isAuthenticated,
  isAuthorized("Admin"),
  getBorrowedBooksForAdmin
);

// ========== User: View My Borrowed Books ==========
router.get(
  "/my-borrowed-books",
  isAuthenticated,
  borrowedBooks
);

// ========== Admin/User: Return a Book ==========
router.put(
  "/return-borrow-book/:bookId",
  isAuthenticated,
  isAuthorized("Admin", "user"),
  returnBorrowBook
);

export default router;
