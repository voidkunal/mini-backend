import catchAsyncErrors from "./catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  console.log("🔍 Cookies:", req.cookies);

  const { token } = req.cookies;
  if (!token) return next(new ErrorHandler("User is not authenticated", 401));

  const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);
  console.log("✅ Decoded JWT:", decodedData);

  req.user = await User.findById(decodedData.id);
  if (!req.user) return next(new ErrorHandler("User not found", 404));

  next();
});

export const isAuthorized = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(`Role (${req.user.role}) is not allowed to access this resource.`, 403)
      );
    }
    next();
  };
};