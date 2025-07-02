
import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
      minlength: 1,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    availability: {
      type: Boolean,
      default: true,
    },
    filePath: {
      type: String,
      required: true, // This stores the local file path (PDF/image)
    },
    fileType: {
      type: String,
      enum: ["pdf", "jpg", "jpeg", "png"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Book = mongoose.model("Book", bookSchema);
