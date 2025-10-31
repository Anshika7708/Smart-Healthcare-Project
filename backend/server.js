import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Import routes
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import reportRoutes from "./routes/report.js";
import vitalRoutes from "./routes/vital.js";
import prescriptionRoutes from "./routes/prescriptionRoutes.js";

// Configuration
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/vitals", vitalRoutes);
app.use("/api/prescriptions", prescriptionRoutes);

// Test route
app.get("/", (req, res) => {
	res.json({ message: "Smart Healthcare API is running!" });
});

// Database connection
mongoose
	.connect(process.env.MONGODB_URI)
	.then(() => {
		console.log("✅ Connected to MongoDB");
		app.listen(PORT, () => {
			console.log(`🚀 Server running on port ${PORT}`);
		});
	})
	.catch((error) => {
		console.error("❌ MongoDB connection error:", error);
	});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
	console.error("Unhandled Rejection:", err);
});
