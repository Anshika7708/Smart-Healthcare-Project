import express from "express";
import {
	getUserProfile,
	updateUserProfile,
} from "../controllers/userController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.get("/:id", authenticate, getUserProfile);
router.put("/update/:id", authenticate, updateUserProfile);

export default router;
