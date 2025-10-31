import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
	Stethoscope,
	FlaskRound,
	Pill,
	Plus,
	X,
	Edit2,
	Trash2,
	Check,
	Clock,
	Sun,
	Sunset,
	Moon,
	Save,
	ChevronDown,
	Search,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { createPrescription, getAllPrescriptions } from "../api/api";

const Prescription = () => {
	const { user } = useAuth();
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		doctorName: "",
		medicalIssue: "",
	});

	const [tests, setTests] = useState([]);
	const [medicines, setMedicines] = useState([]);
	const [notes, setNotes] = useState("");

	const [testInput, setTestInput] = useState("");
	const [medicineInput, setMedicineInput] = useState("");

	const [showDoseModal, setShowDoseModal] = useState(false);
	const [selectedMedicine, setSelectedMedicine] = useState(null);
	const [doses, setDoses] = useState({ morning: 0, noon: 0, evening: 0 });

	const [editingTest, setEditingTest] = useState(null);
	const [editingMedicine, setEditingMedicine] = useState(null);

	const [loading, setLoading] = useState(false);
	const [prescriptions, setPrescriptions] = useState([]);

	const testInputRef = useRef(null);
	const medicineInputRef = useRef(null);

	// Load all prescriptions on mount
	useEffect(() => {
		fetchPrescriptions();
	}, []);

	const fetchPrescriptions = async () => {
		try {
			const response = await getAllPrescriptions();
			setPrescriptions(response.data.prescriptions || []);
		} catch (error) {
			console.error("Error fetching prescriptions:", error);
		}
	};

	// Handle test input
	const handleTestKeyPress = (e) => {
		if (e.key === "Enter" && testInput.trim()) {
			e.preventDefault();
			addTest(testInput);
		}
	};

	const addTest = (testName) => {
		if (tests.find((t) => t.name === testName)) {
			toast.error("Test already added!");
			return;
		}

		const newTest = {
			name: testName,
			serialNo: tests.length + 1,
		};

		setTests([...tests, newTest]);
		setTestInput("");
		toast.success("Test added!");
	};

	const updateTest = (serialNo, newName) => {
		setTests(
			tests.map((test) =>
				test.serialNo === serialNo ? { ...test, name: newName } : test
			)
		);
		setEditingTest(null);
		toast.success("Test updated!");
	};

	const deleteTest = (serialNo) => {
		setTests(tests.filter((test) => test.serialNo !== serialNo));
		// Reorder serial numbers
		const reordered = tests
			.filter((test) => test.serialNo !== serialNo)
			.map((test, index) => ({ ...test, serialNo: index + 1 }));
		setTests(reordered);
		toast.success("Test removed!");
	};

	// Handle medicine with dose modal
	const handleMedicineSelection = (medicineName) => {
		setSelectedMedicine(medicineName);
		setShowDoseModal(true);
		setDoses({ morning: 0, noon: 0, evening: 0 });
	};

	const handleMedicineKeyPress = (e) => {
		if (e.key === "Enter" && medicineInput.trim()) {
			e.preventDefault();
			handleMedicineSelection(medicineInput);
		}
	};

	const saveMedicineWithDose = () => {
		if (!selectedMedicine) return;

		if (medicines.find((m) => m.name === selectedMedicine)) {
			toast.error("Medicine already added!");
			setShowDoseModal(false);
			setMedicineInput("");
			return;
		}

		const newMedicine = {
			name: selectedMedicine,
			serialNo: medicines.length + 1,
			doses: { ...doses },
		};

		setMedicines([...medicines, newMedicine]);
		setShowDoseModal(false);
		setMedicineInput("");
		setSelectedMedicine(null);
		toast.success("Medicine added with doses!");
	};

	const updateMedicine = (serialNo, newName, newDoses) => {
		setMedicines(
			medicines.map((med) =>
				med.serialNo === serialNo
					? { ...med, name: newName, doses: newDoses }
					: med
			)
		);
		setEditingMedicine(null);
		toast.success("Medicine updated!");
	};

	const deleteMedicine = (serialNo) => {
		setMedicines(medicines.filter((med) => med.serialNo !== serialNo));
		// Reorder serial numbers
		const reordered = medicines
			.filter((med) => med.serialNo !== serialNo)
			.map((med, index) => ({ ...med, serialNo: index + 1 }));
		setMedicines(reordered);
		toast.success("Medicine removed!");
	};

	// Submit prescription
	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!formData.doctorName || !formData.medicalIssue) {
			toast.error("Please fill all required fields!");
			return;
		}

		if (!user || !user._id) {
			toast.error("Please log in to create a prescription!");
			console.error("❌ [FRONTEND] User not logged in:", user);
			return;
		}

		setLoading(true);

		try {
			const prescriptionData = {
				userId: user._id,
				doctorName: formData.doctorName,
				medicalIssue: formData.medicalIssue,
				testsPrescribed: tests,
				medicinesPrescribed: medicines,
				notes: notes,
			};

			const response = await createPrescription(prescriptionData);

			if (response.data) {
				toast.success("Prescription created successfully!");
				// Reset form
				setFormData({
					doctorName: "",
					medicalIssue: "",
				});
				setTests([]);
				setMedicines([]);
				setNotes("");
				fetchPrescriptions();
			}
		} catch (error) {
			console.error("❌ [FRONTEND] Error creating prescription:", error);
			console.error("❌ [FRONTEND] Error response:", error.response);
			console.error("❌ [FRONTEND] Error message:", error.message);
			console.error("❌ [FRONTEND] Error config:", error.config);

			toast.error(
				error.response?.data?.message ||
					error.message ||
					"Failed to create prescription"
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
			<Navbar />

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
						<Stethoscope className="w-10 h-10 text-indigo-600" />
						Create Prescription
					</h1>
					<p className="text-gray-600">
						Prescribe medicines and tests for your patients
					</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Main Form */}
					<div className="lg:col-span-2">
						<form
							onSubmit={handleSubmit}
							className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 space-y-6"
						>
							{/* Doctor Info */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-semibold text-gray-700 mb-2">
										Doctor Name *
									</label>
									<input
										type="text"
										value={formData.doctorName}
										onChange={(e) =>
											setFormData({
												...formData,
												doctorName: e.target.value,
											})
										}
										placeholder="Enter doctor name"
										className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
										required
									/>
								</div>

								<div>
									<label className="block text-sm font-semibold text-gray-700 mb-2">
										Medical Issue *
									</label>
									<input
										type="text"
										value={formData.medicalIssue}
										onChange={(e) =>
											setFormData({
												...formData,
												medicalIssue: e.target.value,
											})
										}
										placeholder="e.g., Fever, Headache, Diabetes"
										className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
										required
									/>
								</div>
							</div>

							{/* Tests Prescribed */}
							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
									<FlaskRound className="w-5 h-5 text-indigo-600" />
									Tests Prescribed
								</label>

								<div className="relative">
									<input
										ref={testInputRef}
										type="text"
										value={testInput}
										onChange={(e) =>
											setTestInput(e.target.value)
										}
										onKeyPress={handleTestKeyPress}
										placeholder="Type test name and press Enter"
										className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
									/>
									<Search className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
								</div>

								{/* Tests List */}
								{tests.length > 0 && (
									<div className="mt-4 space-y-2">
										{tests.map((test) => (
											<div
												key={test.serialNo}
												className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100"
											>
												<span className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
													{test.serialNo}
												</span>
												{editingTest ===
												test.serialNo ? (
													<>
														<input
															type="text"
															defaultValue={
																test.name
															}
															onBlur={(e) =>
																updateTest(
																	test.serialNo,
																	e.target
																		.value
																)
															}
															onKeyPress={(e) => {
																if (
																	e.key ===
																	"Enter"
																) {
																	updateTest(
																		test.serialNo,
																		e.target
																			.value
																	);
																}
															}}
															className="flex-1 px-3 py-1 border border-gray-300 rounded-lg"
															autoFocus
														/>
													</>
												) : (
													<>
														<span className="flex-1 text-gray-800">
															{test.name}
														</span>
														<button
															type="button"
															onClick={() =>
																setEditingTest(
																	test.serialNo
																)
															}
															className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
														>
															<Edit2 className="w-4 h-4 text-indigo-600" />
														</button>
														<button
															type="button"
															onClick={() =>
																deleteTest(
																	test.serialNo
																)
															}
															className="p-2 hover:bg-red-100 rounded-lg transition-colors"
														>
															<Trash2 className="w-4 h-4 text-red-600" />
														</button>
													</>
												)}
											</div>
										))}
									</div>
								)}
							</div>

							{/* Medicines Prescribed */}
							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
									<Pill className="w-5 h-5 text-indigo-600" />
									Medicines Prescribed
								</label>

								<div className="relative">
									<input
										ref={medicineInputRef}
										type="text"
										value={medicineInput}
										onChange={(e) =>
											setMedicineInput(e.target.value)
										}
										onKeyPress={handleMedicineKeyPress}
										placeholder="Type medicine name and press Enter"
										className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
									/>
									<Search className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
								</div>

								{/* Medicines List */}
								{medicines.length > 0 && (
									<div className="mt-4 space-y-2">
										{medicines.map((medicine) => (
											<div
												key={medicine.serialNo}
												className="p-4 bg-green-50 rounded-xl border border-green-100"
											>
												<div className="flex items-start gap-3">
													<span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
														{medicine.serialNo}
													</span>
													<div className="flex-1">
														<div className="flex items-center justify-between mb-2">
															<span className="font-semibold text-gray-800">
																{medicine.name}
															</span>
															<div className="flex gap-2">
																<button
																	type="button"
																	onClick={() =>
																		setEditingMedicine(
																			medicine.serialNo
																		)
																	}
																	className="p-1.5 hover:bg-green-100 rounded-lg transition-colors"
																>
																	<Edit2 className="w-4 h-4 text-green-600" />
																</button>
																<button
																	type="button"
																	onClick={() =>
																		deleteMedicine(
																			medicine.serialNo
																		)
																	}
																	className="p-1.5 hover:bg-red-100 rounded-lg transition-colors"
																>
																	<Trash2 className="w-4 h-4 text-red-600" />
																</button>
															</div>
														</div>
														<div className="flex gap-3 text-sm">
															<div className="flex items-center gap-1 text-orange-600">
																<Sun className="w-4 h-4" />
																<span className="font-medium">
																	Morning:{" "}
																	{
																		medicine
																			.doses
																			.morning
																	}
																</span>
															</div>
															<div className="flex items-center gap-1 text-yellow-600">
																<Sunset className="w-4 h-4" />
																<span className="font-medium">
																	Noon:{" "}
																	{
																		medicine
																			.doses
																			.noon
																	}
																</span>
															</div>
															<div className="flex items-center gap-1 text-indigo-600">
																<Moon className="w-4 h-4" />
																<span className="font-medium">
																	Evening:{" "}
																	{
																		medicine
																			.doses
																			.evening
																	}
																</span>
															</div>
														</div>
													</div>
												</div>
											</div>
										))}
									</div>
								)}
							</div>

							{/* Notes */}
							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-2">
									Additional Notes (Optional)
								</label>
								<textarea
									value={notes}
									onChange={(e) => setNotes(e.target.value)}
									placeholder="Add any additional instructions or notes..."
									rows={4}
									className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
								/>
							</div>

							{/* Submit Button */}
							<button
								type="submit"
								disabled={loading}
								className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
							>
								{loading ? (
									<>
										<Clock className="w-5 h-5 animate-spin" />
										Creating Prescription...
									</>
								) : (
									<>
										<Save className="w-5 h-5" />
										Create Prescription
									</>
								)}
							</button>
						</form>
					</div>

					{/* Recent Prescriptions */}
					<div className="lg:col-span-1">
						<div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
							<h3 className="text-xl font-bold text-gray-800 mb-4">
								Recent Prescriptions
							</h3>
							<div className="space-y-3 max-h-[600px] overflow-y-auto">
								{prescriptions.length === 0 ? (
									<p className="text-gray-500 text-center py-8">
										No prescriptions yet
									</p>
								) : (
									prescriptions
										.slice(0, 10)
										.map((prescription) => (
											<div
												key={prescription._id}
												className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
											>
												<div className="flex items-start justify-between mb-2">
													<div>
														<p className="font-semibold text-gray-800">
															{prescription.userId
																?.fullName ||
																"N/A"}
														</p>
														<p className="text-xs text-gray-500">
															Dr.{" "}
															{
																prescription.doctorName
															}
														</p>
													</div>
													<span
														className={`px-2 py-1 text-xs font-semibold rounded-full ${
															prescription.status ===
															"Active"
																? "bg-green-100 text-green-700"
																: prescription.status ===
																  "Completed"
																? "bg-blue-100 text-blue-700"
																: "bg-red-100 text-red-700"
														}`}
													>
														{prescription.status}
													</span>
												</div>
												<p className="text-sm text-gray-600 mb-2">
													<span className="font-medium">
														Issue:
													</span>{" "}
													{prescription.medicalIssue}
												</p>
												<div className="flex gap-2 text-xs text-gray-500">
													<span className="flex items-center gap-1">
														<FlaskRound className="w-3 h-3" />
														{prescription
															.testsPrescribed
															?.length || 0}{" "}
														tests
													</span>
													<span className="flex items-center gap-1">
														<Pill className="w-3 h-3" />
														{prescription
															.medicinesPrescribed
															?.length || 0}{" "}
														medicines
													</span>
												</div>
												<p className="text-xs text-gray-400 mt-2">
													{new Date(
														prescription.createdAt
													).toLocaleDateString()}
												</p>
											</div>
										))
								)}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Dose Modal */}
			{showDoseModal && (
				<div
					className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
					onClick={(e) => {
						if (e.target === e.currentTarget) {
							setShowDoseModal(false);
							setMedicineInput("");
							setSelectedMedicine(null);
						}
					}}
				>
					<div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
						<h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
							<Pill className="w-6 h-6 text-indigo-600" />
							Set Doses for {selectedMedicine}
						</h3>

						<div className="space-y-4">
							<div className="p-4 bg-orange-50 rounded-xl">
								<label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
									<Sun className="w-5 h-5 text-orange-500" />
									Morning
								</label>
								<input
									type="number"
									min="0"
									value={doses.morning}
									onChange={(e) =>
										setDoses({
											...doses,
											morning:
												parseInt(e.target.value) || 0,
										})
									}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
								/>
							</div>

							<div className="p-4 bg-yellow-50 rounded-xl">
								<label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
									<Sunset className="w-5 h-5 text-yellow-500" />
									Noon
								</label>
								<input
									type="number"
									min="0"
									value={doses.noon}
									onChange={(e) =>
										setDoses({
											...doses,
											noon: parseInt(e.target.value) || 0,
										})
									}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
								/>
							</div>

							<div className="p-4 bg-indigo-50 rounded-xl">
								<label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
									<Moon className="w-5 h-5 text-indigo-500" />
									Evening
								</label>
								<input
									type="number"
									min="0"
									value={doses.evening}
									onChange={(e) =>
										setDoses({
											...doses,
											evening:
												parseInt(e.target.value) || 0,
										})
									}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
								/>
							</div>
						</div>

						<div className="flex gap-3 mt-6">
							<button
								onClick={() => {
									setShowDoseModal(false);
									setMedicineInput("");
									setSelectedMedicine(null);
								}}
								className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
							>
								Cancel
							</button>
							<button
								onClick={saveMedicineWithDose}
								className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
							>
								Add Medicine
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Prescription;
