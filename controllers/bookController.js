import { Book } from "../models/bookModel.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ========== Add New Book ==========
export const addBook = catchAsyncErrors(async (req, res, next) => {
  const { title, description, author, price, quantity } = req.body;

  if (!req.file) {
    return next(new ErrorHandler("Please upload a file", 400));
  }

  const fileExtension = path.extname(req.file.originalname).substring(1).toLowerCase();
  const allowedTypes = ["pdf", "jpg", "jpeg", "png"];

  if (!allowedTypes.includes(fileExtension)) {
    await fs.unlink(req.file.path); // Clean up invalid upload
    return next(new ErrorHandler("Only PDF, JPG, JPEG, PNG files are allowed", 400));
  }

  // const filePath = path.resolve(req.file.path);
  const filePath = req.file.filename; 


  const book = await Book.create({
    title,
    author,
    description,
    price,
    quantity,
    availability: quantity > 0,
    filePath,
    fileType: fileExtension,
  });

  res.status(201).json({
    success: true,
    message: "Book uploaded successfully",
    book,
  });
});

// ========== Get All Books ==========
export const getAllBooks = catchAsyncErrors(async (req, res, next) => {
  const books = await Book.find();
  res.status(200).json({
    success: true,
    books,
  });
});

// ========== Delete Book ==========
export const deleteBook = catchAsyncErrors(async (req, res, next) => {
  const book = await Book.findById(req.params.id);
  if (!book) return next(new ErrorHandler("Book not found", 404));

  try {
    if (book.filePath) {
      await fs.unlink(book.filePath); // Delete from disk
    }
  } catch (error) {
    console.error("Failed to delete book file:", error.message);
  }

  await book.deleteOne();

  res.status(200).json({
    success: true,
    message: "Book deleted successfully",
  });
});