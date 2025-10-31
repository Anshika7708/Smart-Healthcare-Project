import User from "../models/User.js";

// Get user profile
export const getUserProfile = async (req, res) => {
	try {
		const { id } = req.params;

		const user = await User.findById(id).select("-password");
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		res.status(200).json(user);
	} catch (error) {
		console.error("Get user profile error:", error);
		res.status(500).json({ message: "Server error" });
	}
};

// Update user profile
export const updateUserProfile = async (req, res) => {
	try {
		const { id } = req.params;
		const updates = req.body;

		// Don't allow password or email updates through this endpoint
		delete updates.password;
		delete updates.email;
		delete updates.qrCode;

		const user = await User.findByIdAndUpdate(id, updates, {
			new: true,
			runValidators: true,
		}).select("-password");

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		res.status(200).json({
			message: "Profile updated successfully",
			user,
		});
	} catch (error) {
		console.error("Update user profile error:", error);
		res.status(500).json({ message: "Server error" });
	}
};
