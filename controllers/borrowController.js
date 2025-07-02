import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { Borrow } from "../models/borrowModel.js";
import { Book } from "../models/bookModel.js";
import { User } from "../models/userModel.js";
import { calculateFine } from "../utils/fineCalculator.js";

// ========== Record Borrow ==========
export const recordBorrowedBook = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { email } = req.body;

  const book = await Book.findById(id);
  if (!book) return next(new ErrorHandler("Book not found.", 404));

  const user = await User.findOne({ email, accountVerified: true });
  if (!user) return next(new ErrorHandler("User not found or not verified.", 404));

  if (book.quantity === 0) {
    return next(new ErrorHandler("Book is currently not available.", 400));
  }

  const isAlreadyBorrowed = user.borrowedBooks.find(
    (b) => b.bookId.toString() === book._id.toString() && !b.returned
  );
  if (isAlreadyBorrowed) {
    return next(new ErrorHandler("Book is already borrowed by this user.", 400));
  }

  const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  // Update book stock
  book.quantity -= 1;
  book.availability = book.quantity > 0;
  await book.save();

  // Update user borrowed books
  user.borrowedBooks.push({
    bookId: book._id,
    bookTitle: book.title,
    borrowedDate: new Date(),
    dueDate,
  });
  await user.save();

  // Add borrow entry
  await Borrow.create({
    user: { id: user._id, name: user.name, email: user.email },
    book: book._id,
    dueDate,
    price: book.price,
  });

  res.status(200).json({
    success: true,
    message: "Borrowed book recorded successfully.",
  });
});

// ========== Get User's Borrowed Books ==========
export const borrowedBooks = catchAsyncErrors(async (req, res, next) => {
  res.status(200).json({
    success: true,
    borrowedBooks: req.user?.borrowedBooks || [],
  });
});

// ========== Admin View All Borrow Records ==========
export const getBorrowedBooksForAdmin = catchAsyncErrors(async (req, res, next) => {
  const all = await Borrow.find();
  res.status(200).json({
    success: true,
    borrowedBooks: all,
  });
});

// ========== Return Borrowed Book ==========
export const returnBorrowBook = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;
  const { bookId } = req.params;

  const book = await Book.findById(bookId);
  if (!book) return next(new ErrorHandler("Book not found.", 404));

  const user = await User.findOne({ email, accountVerified: true });
  if (!user) return next(new ErrorHandler("User not found or not verified.", 404));

  const borrowed = user.borrowedBooks.find(
    (b) => b.bookId.toString() === bookId && !b.returned
  );
  if (!borrowed) {
    return next(new ErrorHandler("Book was not borrowed or already returned.", 400));
  }

  borrowed.returned = true;
  await user.save();

  book.quantity += 1;
  book.availability = book.quantity > 0;
  await book.save();

  const borrowRecord = await Borrow.findOne({
    book: bookId,
    "user.email": email,
    returnDate: null,
  });

  if (!borrowRecord) {
    return next(new ErrorHandler("No active borrow record found for this book.", 400));
  }

  borrowRecord.returnDate = new Date();
  const fine = calculateFine(borrowRecord.dueDate);
  borrowRecord.fine = fine;
  await borrowRecord.save();

  res.status(200).json({
    success: true,
    message:
      fine !== 0
        ? `The book has been returned. Total fine is ₹${book.price + fine}.`
        : `The book has been returned. Total charge is ₹${book.price}.`,
  });
});
