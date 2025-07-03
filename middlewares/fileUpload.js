import multer from "multer";
import path from "path";
import fs from "fs";
import ErrorHandler from "./errorMiddlewares.js";

// ========== Ensure Upload Directory Exists ==========
const uploadPath = "uploads/books/";

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// ========== Multer Storage Engine ==========
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}_${file.originalname}`;
    cb(null, uniqueName);
  }
});

// ========== File Type Filter ==========
const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|jpg|jpeg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new ErrorHandler("Only PDF, JPG, JPEG, PNG files are allowed", 400));
  }
};

// ========== Multer Upload Middleware ==========
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
});

export default upload;
