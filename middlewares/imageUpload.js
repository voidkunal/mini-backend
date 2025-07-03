import expressFileUpload from "express-fileupload";
import fs from "fs";
import path from "path";

// ========== Temporary Upload Directory ==========
const tempDir = path.join(process.cwd(), "tmp");

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// ========== Express File Upload Middleware for Images ==========
export const imageUpload = expressFileUpload({
  useTempFiles: true,
  tempFileDir: tempDir,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
  abortOnLimit: true,
  createParentPath: true,
});
