

import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  role: {
    type: String,
    enum: ["user", "Admin"],
    default: "user",
  },
  accountVerified: {
    type: Boolean,
    default: false,
  },

  // ✅ Updated field: borrowedBooks (not borrowedVideos)
  borrowedBooks: [
    {
      bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
        required: true,
      },
      returned: {
        type: Boolean,
        default: false,
      },
      bookTitle: String,
      borrowedDate: Date,
      dueDate: Date,
    },
  ],

  avatar: {
    public_id: String,
    url: String,
  },
  verificationCode: {
    type: Number,
  },
  verificationCodeExpire: {
    type: Date,
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpire: {
    type: Date,
  },
}, { timestamps: true });

userSchema.methods.generateVerificationCode = function () {
  function generateRandomFiveDigitNumber() {
    const firstDigit = Math.floor(Math.random() * 9) + 1;
    const remainingDigits = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
    return parseInt(firstDigit + remainingDigits);
  }

  const verificationCode = generateRandomFiveDigitNumber();
  this.verificationCode = verificationCode;
  this.verificationCodeExpire = Date.now() + 4 * 60 * 1000;
  return verificationCode;
};

userSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

export const User = mongoose.model("User", userSchema);
