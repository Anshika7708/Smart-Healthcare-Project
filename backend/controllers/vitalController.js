import Vital from "../models/Vital.js";

// Add vital reading
export const addVital = async (req, res) => {
	try {
		const {
			userId,
			day,
			heartRate,
			bloodPressure,
			oxygenLevel,
			temperature,
		} = req.body;

		const vital = new Vital({
			userId,
			day,
			heartRate,
			bloodPressure,
			oxygenLevel,
			temperature,
		});

		await vital.save();

		res.status(201).json({
			message: "Vital reading added successfully",
			vital,
		});
	} catch (error) {
		console.error("Add vital error:", error);
		res.status(500).json({ message: "Server error" });
	}
};

// Get user vitals
export const getUserVitals = async (req, res) => {
	try {
		const { userId } = req.params;

		const vitals = await Vital.find({ userId })
			.sort({ recordDate: -1 })
			.limit(7); // Get last 7 readings

		res.status(200).json(vitals);
	} catch (error) {
		console.error("Get user vitals error:", error);
		res.status(500).json({ message: "Server error" });
	}
};

// Initialize sample vitals for new user
export const initializeSampleVitals = async (req, res) => {
	try {
		const { userId } = req.body;

		const sampleVitals = [
			{
				day: "Mon",
				heartRate: 75,
				bloodPressure: 120,
				oxygenLevel: 97,
				temperature: 36.5,
			},
			{
				day: "Tue",
				heartRate: 78,
				bloodPressure: 122,
				oxygenLevel: 96,
				temperature: 36.8,
			},
			{
				day: "Wed",
				heartRate: 72,
				bloodPressure: 118,
				oxygenLevel: 98,
				temperature: 36.6,
			},
			{
				day: "Thu",
				heartRate: 76,
				bloodPressure: 121,
				oxygenLevel: 97,
				temperature: 36.7,
			},
			{
				day: "Fri",
				heartRate: 74,
				bloodPressure: 119,
				oxygenLevel: 98,
				temperature: 36.5,
			},
			{
				day: "Sat",
				heartRate: 73,
				bloodPressure: 117,
				oxygenLevel: 97,
				temperature: 36.6,
			},
			{
				day: "Sun",
				heartRate: 77,
				bloodPressure: 120,
				oxygenLevel: 96,
				temperature: 36.8,
			},
		];

		const vitals = await Vital.insertMany(
			sampleVitals.map((v) => ({ ...v, userId }))
		);

		res.status(201).json({
			message: "Sample vitals initialized",
			vitals,
		});
	} catch (error) {
		console.error("Initialize sample vitals error:", error);
		res.status(500).json({ message: "Server error" });
	}
};
