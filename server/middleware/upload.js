import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const allowed = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "campus-complaints",
      allowed_formats: ["jpg", "png", "jpeg", "pdf", "docx"],
      resource_type: "auto",
    };
  },
});

const fileFilter = (req, file, cb) => {
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only JPG,PNG, and PDF are allowed"));
};

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, //5MB
    fileFilter,
});

export default upload;
