import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

const hasCloudinaryConfig = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET,
);

if (hasCloudinaryConfig) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
} else {
  console.warn(
    "Cloudinary is not fully configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.",
  );
}

// ================= CLOUDINARY STORAGE =================
const storage = hasCloudinaryConfig
  ? new CloudinaryStorage({
      cloudinary,
      params: async (req, file) => {
        const sanitizedName = file.originalname
          .split(".")[0]
          .replace(/[^a-zA-Z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .toLowerCase();

        return {
          folder: "EMS/events",
          resource_type: "image",
          public_id: `${Date.now()}-${sanitizedName}`,
          allowed_formats: ["jpg", "jpeg", "png", "webp"],
          transformation: [{ fetch_format: "auto", quality: "auto" }],
        };
      },
    })
  : multer.memoryStorage();

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
    fileSize: 5 * 1024 * 1024,
  },
});

export const uploadEventImage = (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        message: `Upload failed: ${err.message}`,
      });
    }

    if (req.file && !hasCloudinaryConfig) {
      return res.status(500).json({
        message:
          "Cloudinary is not configured on server. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.",
      });
    }

    return next();
  });
};

export const getUploadedImageData = (file) => {
  if (!file) {
    return { imageUrl: "", imagePublicId: "" };
  }

  return {
    imageUrl: file.path || file.secure_url || file.url || "",
    imagePublicId: file.filename || file.public_id || "",
  };
};

export default upload;
export { cloudinary };
