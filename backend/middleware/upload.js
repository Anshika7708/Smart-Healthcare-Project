import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import path from "path";

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
	cloudinary: cloudinary,
	params: {
		folder: "smart-healthcare/reports", // Folder in Cloudinary
		allowed_formats: ["jpg", "jpeg", "png", "pdf", "doc", "docx"],
		resource_type: "auto", // Automatically detect resource type
		public_id: (req, file) => {
			// Generate unique filename
			const uniqueSuffix =
				Date.now() + "-" + Math.round(Math.random() * 1e9);
			const originalName = file.originalname.replace(/\.[^/.]+$/, ""); // Remove extension
			return `${uniqueSuffix}-${originalName}`;
		},
	},
});

// File filter
const fileFilter = (req, file, cb) => {
	const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
	const extname = allowedTypes.test(
		path.extname(file.originalname).toLowerCase()
	);
	const mimetype = allowedTypes.test(file.mimetype);

	if (extname && mimetype) {
		cb(null, true);
	} else {
		cb(new Error("Only images, PDFs, and documents are allowed"));
	}
};

// Multer upload configuration
export const upload = multer({
	storage: storage,
	limits: {
		fileSize: 10 * 1024 * 1024, // 10MB limit
	},
	fileFilter: fileFilter,
});
