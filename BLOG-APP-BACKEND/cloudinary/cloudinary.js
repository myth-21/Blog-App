import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export const upload = multer({
  storage: multer.memoryStorage(), //to avoid RAM overflow
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
  //for security validation
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png"
    ) {
      cb(null, true);
    } else {
      const err = new Error("Only JPG and PNG allowed");
      err.status = 400;
      cb(err, false);
    }
  },
});

export const uploadToCloudinary = (buffer) => {
  // Gracefully handle missing Cloudinary credentials
  if (!process.env.CLOUD_NAME || !process.env.API_KEY || !process.env.API_SECRET) {
    console.warn("Cloudinary credentials missing. Skipping image upload.");
    return Promise.resolve(null);
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "blog_users" },
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
};

export { cloudinary };
