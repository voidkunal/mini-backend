// middlewares/authMiddleware.js

import catchAsyncErrors from "./catchAsyncErrors.js";
import ErrorHandler from "./errorMiddlewares.js";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("User is not authenticated", 401));
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);

  if (process.env.NODE_ENV !== "production") {
    console.log("✅ Auth Decoded Token:", decodedData);
  }

  req.user = await User.findById(decodedData.id);

  if (!req.user) {
    return next(new ErrorHandler("User not found", 404));
  }

  next();
});

export const isAuthorized = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role (${req.user.role}) is not allowed to access this resource.`,
          403
        )
      );
    }
    next();
  };
};
