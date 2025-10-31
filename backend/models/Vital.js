import mongoose from "mongoose";

const vitalSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		day: {
			type: String,
			required: true,
		},
		heartRate: {
			type: Number,
			required: true,
			min: 40,
			max: 200,
		},
		bloodPressure: {
			type: Number,
			required: true,
			min: 60,
			max: 200,
		},
		oxygenLevel: {
			type: Number,
			required: true,
			min: 70,
			max: 100,
		},
		temperature: {
			type: Number,
			required: true,
			min: 35,
			max: 42,
		},
		recordDate: {
			type: Date,
			default: Date.now,
		},
	},
	{
		timestamps: true,
	}
);

const Vital = mongoose.model("Vital", vitalSchema);

export default Vital;
