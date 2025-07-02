// middlewares/errorMiddlewares.js

class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorMiddleware = (err, req, res, next) => {
  // Use default values
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Mongoose: Duplicate key error
  if (err.code === 11000) {
    message = "Duplicate field value entered";
    statusCode = 400;
  }

  // JWT Expired
  if (err.name === "TokenExpiredError") {
    message = "JWT token has expired, please login again.";
    statusCode = 401;
  }

  // JWT Invalid
  if (err.name === "JsonWebTokenError") {
    message = "Invalid JWT token, please try again.";
    statusCode = 401;
  }

  // Invalid MongoDB ObjectId
  if (err.name === "CastError") {
    message = `Resource not found. Invalid field: ${err.path}`;
    statusCode = 400;
  }

  // Validation Errors (e.g., from Mongoose)
  if (err.errors) {
    message = Object.values(err.errors).map(e => e.message).join(" ");
    statusCode = 400;
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};

export default ErrorHandler;
