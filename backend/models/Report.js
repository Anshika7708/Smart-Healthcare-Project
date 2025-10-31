import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		fileName: {
			type: String,
			required: true,
		},
		fileType: {
			type: String,
			enum: ["Report", "Prescription"],
			required: true,
		},
		filePath: {
			type: String,
			required: true,
		},
		cloudinaryPublicId: {
			type: String,
		},
		uploadDate: {
			type: Date,
			default: Date.now,
		},
		fileSize: {
			type: Number,
		},
		mimeType: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

const Report = mongoose.model("Report", reportSchema);

export default Report;
