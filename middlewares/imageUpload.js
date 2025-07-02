// middlewares/imageUpload.js

import expressFileUpload from "express-fileupload";
import fs from "fs";
import path from "path";

// Define safer cross-platform temp directory
const tempDir = path.join(process.cwd(), "tmp");

// Ensure temp directory exists
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Setup image upload middleware
export const imageUpload = expressFileUpload({
  useTempFiles: true,
  tempFileDir: tempDir,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  abortOnLimit: true,
  createParentPath: true,
});
