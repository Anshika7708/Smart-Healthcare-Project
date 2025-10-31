import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import QRCode from "qrcode";
import User from "../models/User.js";

// Signup controller
export const signup = async (req, res) => {
	try {
		const {
			fullName,
			age,
			gender,
			maritalStatus,
			contact,
			medicalHistory,
			emergencyContact,
			email,
			password,
		} = req.body;

		// Check if user already exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res
				.status(400)
				.json({ message: "User already exists with this email" });
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(password, 12);

		// Create new user
		const user = new User({
			fullName,
			age,
			gender,
			maritalStatus,
			contact,
			medicalHistory,
			emergencyContact,
			email,
			password: hashedPassword,
		});

		await user.save();

		// Generate QR code with user ID
		const qrCodeData = `${
			process.env.FRONTEND_URL || "http://localhost:5173"
		}/patient/${user._id}`;
		const qrCodeImage = await QRCode.toDataURL(qrCodeData);

		// Update user with QR code
		user.qrCode = qrCodeImage;
		await user.save();

		// Generate JWT token
		const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
			expiresIn: "7d",
		});

		res.status(201).json({
			message: "User created successfully",
			token,
			user: {
				_id: user._id,
				fullName: user.fullName,
				email: user.email,
				qrCode: user.qrCode,
			},
		});
	} catch (error) {
		console.error("Signup error:", error);
		res.status(500).json({ message: "Server error during signup" });
	}
};

// Login controller
export const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		// Find user by email
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Verify password
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		// Generate JWT token
		const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
			expiresIn: "7d",
		});

		res.status(200).json({
			message: "Login successful",
			token,
			user: {
				_id: user._id,
				fullName: user.fullName,
				email: user.email,
				qrCode: user.qrCode,
			},
		});
	} catch (error) {
		console.error("Login error:", error);
		res.status(500).json({ message: "Server error during login" });
	}
};
