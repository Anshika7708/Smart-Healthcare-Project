import Report from "../models/Report.js";
import cloudinary from "../config/cloudinary.js";

// Upload report
export const uploadReport = async (req, res) => {
	try {
		const { userId, fileType } = req.body;

		if (!req.file) {
			return res.status(400).json({ message: "No file uploaded" });
		}

		const report = new Report({
			userId,
			fileName: req.file.originalname,
			fileType,
			filePath: req.file.path, // Cloudinary URL
			cloudinaryPublicId: req.file.filename, // Store Cloudinary public_id for deletion
			fileSize: req.file.size,
			mimeType: req.file.mimetype,
		});

		await report.save();

		res.status(201).json({
			message: "Report uploaded successfully",
			report,
		});
	} catch (error) {
		console.error("Upload report error:", error);
		res.status(500).json({ message: "Server error during upload" });
	}
};

// Get user reports
export const getUserReports = async (req, res) => {
	try {
		const { userId } = req.params;

		const reports = await Report.find({ userId }).sort({ uploadDate: -1 });

		res.status(200).json(reports);
	} catch (error) {
		console.error("Get user reports error:", error);
		res.status(500).json({ message: "Server error" });
	}
};

// Delete report
export const deleteReport = async (req, res) => {
	try {
		const { id } = req.params;

		const report = await Report.findById(id);

		if (!report) {
			return res.status(404).json({ message: "Report not found" });
		}

		// Delete file from Cloudinary if cloudinaryPublicId exists
		if (report.cloudinaryPublicId) {
			try {
				await cloudinary.uploader.destroy(report.cloudinaryPublicId, {
					resource_type: "auto",
				});
			} catch (cloudinaryError) {
				console.error("Cloudinary deletion error:", cloudinaryError);
				// Continue with database deletion even if Cloudinary deletion fails
			}
		}

		// Delete report from database
		await Report.findByIdAndDelete(id);

		res.status(200).json({ message: "Report deleted successfully" });
	} catch (error) {
		console.error("Delete report error:", error);
		res.status(500).json({ message: "Server error" });
	}
};
