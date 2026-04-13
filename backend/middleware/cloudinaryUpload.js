import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

// ================= CONFIGURE CLOUDINARY =================
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ================= CLOUDINARY STORAGE =================
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "EMS/events", // folder in Cloudinary
    resource_type: "auto",
    format: async (req, file) => "jpg",
    public_id: (req, file) => {
      // Create unique public_id: timestamp + original filename
      const timestamp = Date.now();
      const fileName = file.originalname.split(".")[0];
      return `${timestamp}-${fileName}`;
    },
  },
});

// ================= FILE FILTER =================
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only images (JPEG, PNG, JPG) are allowed!"), false);
  }
};

// ================= UPLOAD CONFIG =================
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
});

export default upload;
export { cloudinary };
