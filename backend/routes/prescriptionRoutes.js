import express from "express";
import {
	createPrescription,
	getAllPrescriptions,
	getUserPrescriptions,
	getPrescriptionById,
	updatePrescription,
	deletePrescription,
	updatePrescriptionStatus,
} from "../controllers/prescriptionController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// Create a new prescription
router.post("/", authenticate, createPrescription);

// Get all prescriptions (admin/doctor view)
router.get("/all", authenticate, getAllPrescriptions);

// Get prescriptions for a specific user
router.get("/user/:userId", authenticate, getUserPrescriptions);

// Get a single prescription by ID
router.get("/:id", authenticate, getPrescriptionById);

// Update prescription
router.put("/:id", authenticate, updatePrescription);

// Delete prescription
router.delete("/:id", authenticate, deletePrescription);

// Update prescription status
router.patch("/:id/status", authenticate, updatePrescriptionStatus);

export default router;
