import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendVerificationCode } from "../utils/sendVerificationCode.js";
import sendEmail from "../utils/sendEmail.js";
import { generateForgotPasswordEmailTemplate } from "../utils/emailTemplates.js";
import { sendToken } from "../utils/sendToken.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { User } from "../models/userModel.js";

export const register = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new ErrorHandler("Please enter all fields.", 400));
  }

  const existingUser = await User.findOne({ email });

  if (existingUser && existingUser.accountVerified) {
    return next(new ErrorHandler("User already registered.", 400));
  }

  if (existingUser && !existingUser.accountVerified) {
    const attempts = await User.countDocuments({ email, accountVerified: false });
    if (attempts >= 5) {
      return next(new ErrorHandler("Too many attempts. Please verify your email.", 400));
    }

    if (password.length < 6 || password.length > 10) {
      return next(new ErrorHandler("Password must be 6–10 characters long.", 400));
    }

    existingUser.name = name;
    existingUser.password = await bcrypt.hash(password, 10);
    const verificationCode = existingUser.generateVerificationCode();
    await existingUser.save();

    return sendVerificationCode(verificationCode, email, res);
  }

  if (password.length < 6 || password.length > 10) {
    return next(new ErrorHandler("Password must be 6–10 characters long.", 400));
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ name, email, password: hashedPassword });
  const verificationCode = newUser.generateVerificationCode();
  await newUser.save();

  sendVerificationCode(verificationCode, email, res);
});

export const verifyOTP = catchAsyncErrors(async (req, res, next) => {
  const { email, otp } = req.body;
  if (!email || !otp) return next(new ErrorHandler("Email or OTP is missing.", 400));

  const userAllEntries = await User.find({ email, accountVerified: false }).sort({ createdAt: -1 });
  if (userAllEntries.length === 0) return next(new ErrorHandler("User not found.", 404));

  let user = userAllEntries[0];
  if (userAllEntries.length > 1) {
    await User.deleteMany({ _id: { $ne: user._id }, email, accountVerified: false });
  }

  if (user.verificationCode !== Number(otp)) return next(new ErrorHandler("Invalid OTP", 400));
  if (Date.now() > new Date(user.verificationCodeExpire).getTime()) return next(new ErrorHandler("OTP expired", 400));

  user.accountVerified = true;
  user.verificationCode = null;
  user.verificationCodeExpire = null;
  await user.save({ validateModifiedOnly: true });

  sendToken(user, 200, "Account verified", res);
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) return next(new ErrorHandler("Please enter all fields.", 400));

  const user = await User.findOne({ email, accountVerified: true }).select("+password");
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new ErrorHandler("Invalid email or password", 400));
  }

  sendToken(user, 200, "Login successful", res);
});

export const logout = catchAsyncErrors(async (req, res, next) => {
  res.status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    })
    .json({ success: true, message: "Logged out successfully" });
});

export const getUser = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({ success: true, user });
});