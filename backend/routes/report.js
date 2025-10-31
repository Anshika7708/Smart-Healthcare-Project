import express from "express";
import {
	uploadReport,
	getUserReports,
	deleteReport,
} from "../controllers/reportController.js";
import { authenticate } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.post("/upload", authenticate, upload.single("file"), uploadReport);
router.get("/:userId", authenticate, getUserReports);
router.delete("/:id", authenticate, deleteReport);

export default router;
