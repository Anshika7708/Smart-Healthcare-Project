import mongoose from "mongoose";
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();
const prescriptionSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		doctorName: {
			type: String,
			required: true,
		},
		medicalIssue: {
			type: String,
			required: true,
		},
		testsPrescribed: [
			{
				name: {
					type: String,
					required: true,
				},
				serialNo: {
					type: Number,
					required: true,
				},
			},
		],
		medicinesPrescribed: [
			{
				name: {
					type: String,
					required: true,
				},
				serialNo: {
					type: Number,
					required: true,
				},
				doses: {
					morning: {
						type: Number,
						default: 0,
					},
					noon: {
						type: Number,
						default: 0,
					},
					evening: {
						type: Number,
						default: 0,
					},
				},
			},
		],
		status: {
			type: String,
			enum: ["Active", "Completed", "Cancelled"],
			default: "Active",
		},
		notes: {
			type: String,
		},
		aiSuggestion: {
			type: String,
		},
	},
	{ timestamps: true }
);

const generateAISuggestion = async function (
	medicalIssue,
	tests = [],
	medicines = []
) {
	const openai = new OpenAI({
		apiKey: process.env.GEMINI_API_KEY,
		baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
	});

	const testsList = tests
		.map(
			(t) =>
				`• ${t?.name || "Test"}${
					t?.serialNo ? ` (No. ${t.serialNo})` : ""
				}`
		)
		.join("\n");

	const medsList = medicines
		.map((m) => {
			const doses = m?.doses || {};
			const parts = [];
			if (doses.morning) parts.push(`morning:${doses.morning}`);
			if (doses.noon) parts.push(`noon:${doses.noon}`);
			if (doses.evening) parts.push(`evening:${doses.evening}`);
			const doseStr = parts.length ? ` [${parts.join(", ")}]` : "";
			return `• ${m?.name || "Medicine"}${
				m?.serialNo ? ` (No. ${m.serialNo})` : ""
			}${doseStr}`;
		})
		.join("\n");

	const messages = [
		{
			role: "system",
			content:
				"You are a compassionate clinical wellness assistant. Based on the patient's issue and doctor's orders, suggest safe, gentle lifestyle complements such as yoga/stretching, breathing, light activity, hydration, sleep hygiene, and broad dietary tips. Do not diagnose or contradict medical advice. Output a single supportive paragraph, 30-50 words. Return just the suggestion paragraph without strictly any additional text.",
		},
		{
			role: "user",
			content:
				`Patient concern: ${medicalIssue || "Not specified"}\n` +
				`Doctor-ordered tests:\n${testsList || "• None"}\n` +
				`Prescribed medicines:\n${medsList || "• None"}\n\n` +
				"Task: In 30-50 words, suggest 2–4 practical, non-medical activities (e.g., specific yoga poses, breathing, gentle movement) and broad dietary guidance to support recovery. Avoid medical claims or dosages. End with a brief reassurance.",
		},
	];

	const response = await openai.chat.completions.create({
		model: "gemini-2.0-flash",
		messages,
		temperature: 0.7,
		max_tokens: 120,
	});

	return response.choices?.[0]?.message?.content?.trim() || "";
};

prescriptionSchema.pre("save", async function (next) {
	if (this.isNew) {
		const aiSuggestion = await generateAISuggestion(
			this.medicalIssue,
			this.testsPrescribed,
			this.medicinesPrescribed
		);
		this.aiSuggestion = aiSuggestion;
	}
	next();
});

export default mongoose.model("Prescription", prescriptionSchema);
