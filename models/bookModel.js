// import mongoose from "mongoose";

// const bookSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: true,
//       trim: true,
//       maxlength: 100,
//       minlength: 1,
//     },
//     author: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     description: {
//       type: String,
//       required: true,
//     },
//     price: {
//       type: Number,
//       required: true,
//     },
//     quantity: {
//       type: Number,
//       required: true,
//     },
//     availability: {
//       type: Boolean,
//       default: true,
//     },
//     fileData: { // ✅ This matches what controller and frontend expect
//       type: String,
//       required: true,
//     },
//     fileType: {
//       type: String,
//       enum: ["pdf", "jpg", "jpeg", "png"],
//       required: true,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// export const Book = mongoose.model("Book", bookSchema);


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
    fileBase64: {
      type: String, // ✅ base64-encoded file string
      required: true,
    },
    fileType: {
      type: String,
      enum: ["pdf", "jpg", "jpeg", "png"],
      required: true,
    },
    fileMimeType: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Book = mongoose.model("Book", bookSchema);
