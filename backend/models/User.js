import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		fullName: {
			type: String,
			required: [true, "Full name is required"],
			trim: true,
		},
		age: {
			type: Number,
			required: [true, "Age is required"],
			min: 0,
			max: 150,
		},
		gender: {
			type: String,
			required: [true, "Gender is required"],
			enum: ["Male", "Female", "Other"],
		},
		maritalStatus: {
			type: String,
			required: [true, "Marital status is required"],
			enum: ["Single", "Married", "Divorced", "Widowed"],
		},
		contact: {
			type: String,
			required: [true, "Contact number is required"],
			trim: true,
		},
		medicalHistory: {
			type: String,
			default: "",
		},
		emergencyContact: {
			type: String,
			required: [true, "Emergency contact is required"],
			trim: true,
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			unique: true,
			lowercase: true,
			trim: true,
		},
		password: {
			type: String,
			required: [true, "Password is required"],
			minlength: 6,
		},
		qrCode: {
			type: String,
			default: "",
		},
	},
	{
		timestamps: true,
	}
);

const User = mongoose.model("User", userSchema);

export default User;
