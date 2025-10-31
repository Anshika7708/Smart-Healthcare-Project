import Prescription from "../models/Prescription.js";
import User from "../models/User.js";

// Create a new prescription
export const createPrescription = async (req, res) => {
	try {

		const {
			userId,
			doctorName,
			medicalIssue,
			testsPrescribed,
			medicinesPrescribed,
			notes,
		} = req.body;

		// Validate required fields
		if (!userId || !doctorName || !medicalIssue) {
			console.error(
				"❌ [BACKEND] Validation failed - missing required fields"
			);
			return res.status(400).json({
				message: "User ID, doctor name, and medical issue are required",
			});
		}

		// Check if user exists
		const user = await User.findById(userId);
		if (!user) {
			console.error("❌ [BACKEND] User not found:", userId);
			return res.status(404).json({ message: "User not found" });
		}

		// Create new prescription
		const prescription = new Prescription({
			userId,
			doctorName,
			medicalIssue,
			testsPrescribed: testsPrescribed || [],
			medicinesPrescribed: medicinesPrescribed || [],
			notes: notes || "",
		});

		await prescription.save();

		// Populate user details
		await prescription.populate("userId", "fullName email age gender");

		res.status(201).json({
			message: "Prescription created successfully",
			prescription,
		});
	} catch (error) {
		console.error("❌ [BACKEND] Error creating prescription:", error);
		console.error("❌ [BACKEND] Error stack:", error.stack);
		res.status(500).json({
			message: "Error creating prescription",
			error: error.message,
		});
	}
};

// Get all prescriptions for a user
export const getUserPrescriptions = async (req, res) => {
	try {
		const { userId } = req.params;

		const prescriptions = await Prescription.find({ userId })
			.populate("userId", "fullName email age gender")
			.sort({ createdAt: -1 });

		res.status(200).json({
			message: "Prescriptions retrieved successfully",
			prescriptions,
		});
	} catch (error) {
		console.error("Error fetching prescriptions:", error);
		res.status(500).json({
			message: "Error fetching prescriptions",
			error: error.message,
		});
	}
};

// Get all prescriptions (for admin/doctor view)
export const getAllPrescriptions = async (req, res) => {
	try {
		const prescriptions = await Prescription.find()
			.populate("userId", "fullName email age gender contact")
			.sort({ createdAt: -1 });

		res.status(200).json({
			message: "All prescriptions retrieved successfully",
			prescriptions,
		});
	} catch (error) {
		console.error("Error fetching prescriptions:", error);
		res.status(500).json({
			message: "Error fetching prescriptions",
			error: error.message,
		});
	}
};

// Get a single prescription by ID
export const getPrescriptionById = async (req, res) => {
	try {
		const { id } = req.params;

		const prescription = await Prescription.findById(id).populate(
			"userId",
			"fullName email age gender contact"
		);

		if (!prescription) {
			return res.status(404).json({ message: "Prescription not found" });
		}

		res.status(200).json({
			message: "Prescription retrieved successfully",
			prescription,
		});
	} catch (error) {
		console.error("Error fetching prescription:", error);
		res.status(500).json({
			message: "Error fetching prescription",
			error: error.message,
		});
	}
};

// Update prescription
export const updatePrescription = async (req, res) => {
	try {
		const { id } = req.params;
		const updates = req.body;

		const prescription = await Prescription.findByIdAndUpdate(id, updates, {
			new: true,
			runValidators: true,
		}).populate("userId", "fullName email age gender");

		if (!prescription) {
			return res.status(404).json({ message: "Prescription not found" });
		}

		res.status(200).json({
			message: "Prescription updated successfully",
			prescription,
		});
	} catch (error) {
		console.error("Error updating prescription:", error);
		res.status(500).json({
			message: "Error updating prescription",
			error: error.message,
		});
	}
};

// Delete prescription
export const deletePrescription = async (req, res) => {
	try {
		const { id } = req.params;

		const prescription = await Prescription.findByIdAndDelete(id);

		if (!prescription) {
			return res.status(404).json({ message: "Prescription not found" });
		}

		res.status(200).json({
			message: "Prescription deleted successfully",
		});
	} catch (error) {
		console.error("Error deleting prescription:", error);
		res.status(500).json({
			message: "Error deleting prescription",
			error: error.message,
		});
	}
};

// Update prescription status
export const updatePrescriptionStatus = async (req, res) => {
	try {
		const { id } = req.params;
		const { status } = req.body;

		if (!["Active", "Completed", "Cancelled"].includes(status)) {
			return res.status(400).json({
				message:
					"Invalid status. Must be Active, Completed, or Cancelled",
			});
		}

		const prescription = await Prescription.findByIdAndUpdate(
			id,
			{ status },
			{ new: true }
		).populate("userId", "fullName email age gender");

		if (!prescription) {
			return res.status(404).json({ message: "Prescription not found" });
		}

		res.status(200).json({
			message: "Prescription status updated successfully",
			prescription,
		});
	} catch (error) {
		console.error("Error updating prescription status:", error);
		res.status(500).json({
			message: "Error updating prescription status",
			error: error.message,
		});
	}
};
