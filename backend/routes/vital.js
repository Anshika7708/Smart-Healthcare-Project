import express from "express";
import {
	addVital,
	getUserVitals,
	initializeSampleVitals,
} from "../controllers/vitalController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.post("/add", authenticate, addVital);
router.get("/:userId", authenticate, getUserVitals);
router.post("/initialize", authenticate, initializeSampleVitals);

export default router;
