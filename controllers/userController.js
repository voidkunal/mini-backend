import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";

// ========== Get All Verified Users ==========
export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find({ accountVerified: true });
  res.status(200).json({
    success: true,
    users,
  });
});

// ========== Register New Admin ==========
export const registerNewAdmin = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || !req.files.avatar) {
    return next(new ErrorHandler("Please upload an avatar image", 400));
  }

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new ErrorHandler("Please enter all required fields", 400));
  }

  const isRegistered = await User.findOne({ email, accountVerified: true });
  if (isRegistered) {
    return next(new ErrorHandler("User already registered", 400));
  }

  if (password.length < 6 || password.length > 10) {
    return next(new ErrorHandler("Password must be between 6 to 10 characters", 400));
  }

  const { avatar } = req.files;
  const allowedFormats = ["image/jpeg", "image/jpg", "image/png"];

  if (!allowedFormats.includes(avatar.mimetype)) {
    return next(new ErrorHandler("Only JPG, JPEG, or PNG files are allowed", 400));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const cloudinaryResponse = await cloudinary.uploader.upload(avatar.tempFilePath, {
    folder: "voidtech/avatars",
  });

  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error("Cloudinary upload error:", cloudinaryResponse.error || "Unknown error");
    return next(new ErrorHandler("Image upload failed", 500));
  }

  const newAdmin = await User.create({
    name,
    email,
    password: hashedPassword,
    accountVerified: true,
    avatar: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
    role: "Admin",
  });

  res.status(201).json({
    success: true,
    message: "Admin registered successfully",
    admin: newAdmin,
  });
});

// ========== Update User Avatar ==========
export const updateAvatar = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || !req.files.avatar) {
    return next(new ErrorHandler("Please upload an avatar image", 400));
  }

  const file = req.files.avatar;

  const result = await cloudinary.uploader.upload(file.tempFilePath, {
    folder: "voidtech/avatars",
  });

  if (!result || result.error) {
    return next(new ErrorHandler("Image upload failed", 500));
  }

  req.user.avatar = {
    public_id: result.public_id,
    url: result.secure_url,
  };

  await req.user.save();

  res.status(200).json({
    success: true,
    message: "Avatar updated successfully",
    avatarUrl: result.secure_url,
  });
});
