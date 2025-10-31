import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	Heart,
	FileText,
	Activity,
	QrCode,
	User,
	Mail,
	Phone,
	Calendar,
	Users,
	MapPin,
	Stethoscope,
	AlertCircle,
	Pill,
	ClipboardList,
	Sparkles,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";
import {
	getUserVitals,
	getUserReports,
	getUserProfile,
	getUserPrescriptions,
} from "../api/api";

const Dashboard = () => {
	const { user } = useContext(AuthContext);
	const navigate = useNavigate();
	const [profile, setProfile] = useState(null);
	const [stats, setStats] = useState({
		vitals: 0,
		reports: 0,
	});
	const [latestVitals, setLatestVitals] = useState(null);
	const [latestPrescription, setLatestPrescription] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!user) {
			navigate("/login");
			return;
		}

		const fetchData = async () => {
			try {
				const [profileRes, vitalsRes, reportsRes, prescriptionsRes] =
					await Promise.all([
						getUserProfile(user._id),
						getUserVitals(user._id),
						getUserReports(user._id),
						getUserPrescriptions(user._id),
					]);
				setProfile(profileRes.data);
				setLatestVitals(vitalsRes.data[0] || null);
				setLatestPrescription(
					prescriptionsRes.data.prescriptions?.[0] || null
				);
				setStats({
					vitals: vitalsRes.data.length,
					reports: reportsRes.data.length,
				});
			} catch (error) {
				console.error("Error fetching data:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [user, navigate]);

	// Generate prescription summary from latest prescription
	const generatePrescriptionSummary = () => {
		if (!latestPrescription) {
			return [
				{
					type: "No Prescription",
					title: "No Active Prescriptions",
					description: "No prescriptions available yet",
					status: "N/A",
					color: "blue",
					icon: ClipboardList,
				},
			];
		}

		const summary = [];

		// Add Medical Issue card
		summary.push({
			type: "Medical Issue",
			title: latestPrescription.medicalIssue,
			description: `Prescribed by Dr. ${latestPrescription.doctorName}`,
			status: latestPrescription.status,
			color: "blue",
			icon: Stethoscope,
		});

		// Add Tests Prescribed cards
		if (
			latestPrescription.testsPrescribed &&
			latestPrescription.testsPrescribed.length > 0
		) {
			latestPrescription.testsPrescribed.forEach((test) => {
				summary.push({
					type: "Test Prescribed",
					title: test.name,
					description: `Test #${test.serialNo} - ${latestPrescription.status}`,
					status: latestPrescription.status,
					color: "purple",
					icon: ClipboardList,
				});
			});
		}

		// Add Medicines Prescribed cards
		if (
			latestPrescription.medicinesPrescribed &&
			latestPrescription.medicinesPrescribed.length > 0
		) {
			latestPrescription.medicinesPrescribed.forEach((medicine) => {
				const dosageInfo = [];
				if (medicine.doses.morning > 0)
					dosageInfo.push(`Morning: ${medicine.doses.morning}`);
				if (medicine.doses.noon > 0)
					dosageInfo.push(`Noon: ${medicine.doses.noon}`);
				if (medicine.doses.evening > 0)
					dosageInfo.push(`Evening: ${medicine.doses.evening}`);

				summary.push({
					type: "Medicine",
					title: medicine.name,
					description:
						dosageInfo.length > 0
							? dosageInfo.join(", ")
							: "As directed",
					status: latestPrescription.status,
					color: "green",
					icon: Pill,
				});
			});
		}

		// Add notes if available
		if (latestPrescription.notes) {
			summary.push({
				type: "Doctor's Notes",
				title: "Additional Instructions",
				description: latestPrescription.notes,
				status: "Info",
				color: "red",
				icon: AlertCircle,
			});
		}

		return summary;
	};

	const medicalSummary = generatePrescriptionSummary();

	if (loading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
				<Navbar />
				<div className="flex items-center justify-center h-96">
					<div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
			<Navbar />

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Page Header */}
				<div className="mb-8 animate-fade-in">
					<h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
						Patient Dashboard
					</h1>
					<p className="text-gray-600">
						Comprehensive patient profile and medical summary
					</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Left Column - Patient Profile */}
					<div className="lg:col-span-2 space-y-6">
						{/* Patient Info Card */}
						<div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
							<div className="flex items-start justify-between mb-6">
								<div className="flex items-center gap-4">
									<div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
										<User className="w-10 h-10 text-white" />
									</div>
									<div>
										<h2 className="text-2xl font-bold text-gray-800">
											{profile?.fullName}
										</h2>
										{/* <p className="text-gray-600">
											Patient ID:{" "}
											{user?._id?.slice(-8).toUpperCase()}
										</p> */}
									</div>
								</div>
							</div>

							{/* Patient Details Grid */}
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
								<div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
									<Calendar className="w-5 h-5 text-indigo-600" />
									<div>
										<p className="text-xs text-gray-500">
											Age
										</p>
										<p className="font-semibold text-gray-800">
											{profile?.age} years
										</p>
									</div>
								</div>
								<div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
									<User className="w-5 h-5 text-indigo-600" />
									<div>
										<p className="text-xs text-gray-500">
											Gender
										</p>
										<p className="font-semibold text-gray-800">
											{profile?.gender}
										</p>
									</div>
								</div>
								<div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
									<Heart className="w-5 h-5 text-indigo-600" />
									<div>
										<p className="text-xs text-gray-500">
											Marital Status
										</p>
										<p className="font-semibold text-gray-800">
											{profile?.maritalStatus || "Single"}
										</p>
									</div>
								</div>
								<div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
									<Phone className="w-5 h-5 text-indigo-600" />
									<div>
										<p className="text-xs text-gray-500">
											Contact
										</p>
										<p className="font-semibold text-gray-800">
											{profile?.contact}
										</p>
									</div>
								</div>
								<div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
									<Mail className="w-5 h-5 text-indigo-600" />
									<div>
										<p className="text-xs text-gray-500">
											Email
										</p>
										<p className="font-semibold text-gray-800 truncate">
											{profile?.email}
										</p>
									</div>
								</div>
								<div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
									<Users className="w-5 h-5 text-indigo-600" />
									<div>
										<p className="text-xs text-gray-500">
											Emergency Contact
										</p>
										<p className="font-semibold text-gray-800">
											{profile?.emergencyContact}
										</p>
									</div>
								</div>
							</div>

							{/* Medical History */}
							{profile?.medicalHistory && (
								<div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
									<h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
										<Heart className="w-5 h-5 text-indigo-600" />
										Medical History
									</h3>
									<p className="text-gray-700">
										{profile.medicalHistory}
									</p>
								</div>
							)}
						</div>

						{/* Latest Vitals */}
						{latestVitals && (
							<div className="bg-white rounded-2xl shadow-lg p-6">
								<div className="flex items-center justify-between mb-6">
									<h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
										<Activity className="w-6 h-6 text-indigo-600" />
										Latest Vital Signs
									</h3>
									<button
										onClick={() => navigate("/vitals")}
										className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
									>
										View All →
									</button>
								</div>
								<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
									<div className="text-center p-4 bg-red-50 rounded-xl">
										<Heart className="w-8 h-8 text-red-600 mx-auto mb-2" />
										<p className="text-sm text-gray-600">
											Heart Rate
										</p>
										<p className="text-2xl font-bold text-gray-800">
											{latestVitals.heartRate}
										</p>
										<p className="text-xs text-gray-500">
											bpm
										</p>
									</div>
									<div className="text-center p-4 bg-blue-50 rounded-xl">
										<Activity className="w-8 h-8 text-blue-600 mx-auto mb-2" />
										<p className="text-sm text-gray-600">
											Blood Pressure
										</p>
										<p className="text-2xl font-bold text-gray-800">
											{latestVitals.bloodPressure}
										</p>
										<p className="text-xs text-gray-500">
											mmHg
										</p>
									</div>
									<div className="text-center p-4 bg-green-50 rounded-xl">
										<Activity className="w-8 h-8 text-green-600 mx-auto mb-2" />
										<p className="text-sm text-gray-600">
											Oxygen
										</p>
										<p className="text-2xl font-bold text-gray-800">
											{latestVitals.oxygenLevel}
										</p>
										<p className="text-xs text-gray-500">
											%
										</p>
									</div>
									<div className="text-center p-4 bg-orange-50 rounded-xl">
										<Activity className="w-8 h-8 text-orange-600 mx-auto mb-2" />
										<p className="text-sm text-gray-600">
											Temperature
										</p>
										<p className="text-2xl font-bold text-gray-800">
											{latestVitals.temperature}
										</p>
										<p className="text-xs text-gray-500">
											°C
										</p>
									</div>
								</div>
							</div>
						)}

						{/* QR Code Section */}
						<div className="bg-white rounded-2xl shadow-lg p-6">
							<div className="flex flex-col sm:flex-row items-center gap-6">
								<div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-2xl">
									{user?.qrCode ? (
										<img
											src={user.qrCode}
											alt="QR Code"
											className="w-32 h-32 rounded-xl shadow-md"
										/>
									) : (
										<div className="w-32 h-32 bg-gray-200 rounded-xl flex items-center justify-center">
											<QrCode className="w-12 h-12 text-gray-400" />
										</div>
									)}
								</div>
								<div className="flex-1 text-center sm:text-left">
									<h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2 justify-center sm:justify-start">
										<QrCode className="w-5 h-5 text-indigo-600" />
										Patient QR Code
									</h3>
									<p className="text-gray-600 text-sm mb-3">
										Scan to quickly access patient's
										complete health profile
									</p>
									<div className="flex gap-2 justify-center sm:justify-start">
										<button
											onClick={() => {
												const link =
													document.createElement("a");
												link.href = user.qrCode;
												link.download = `patient-qr-${user._id}.png`;
												link.click();
											}}
											className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors text-sm"
										>
											Download QR
										</button>
										<button
											onClick={() => window.print()}
											className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors text-sm"
										>
											Print
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Right Column - Medical Summary */}
					<div className="lg:col-span-1">
						<div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
							<div className="flex items-center justify-between mb-6">
								<h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
									<ClipboardList className="w-6 h-6 text-indigo-600" />
									Latest Prescription
								</h3>
								{latestPrescription && (
									<button
										onClick={() =>
											navigate("/prescriptions")
										}
										className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
									>
										View All →
									</button>
								)}
							</div>

							<div className="space-y-4">
								{medicalSummary.map((item, index) => {
									const Icon = item.icon;
									const colorClasses = {
										blue: {
											bg: "bg-blue-50",
											text: "text-blue-700",
											border: "border-blue-200",
											icon: "text-blue-600",
										},
										red: {
											bg: "bg-red-50",
											text: "text-red-700",
											border: "border-red-200",
											icon: "text-red-600",
										},
										green: {
											bg: "bg-green-50",
											text: "text-green-700",
											border: "border-green-200",
											icon: "text-green-600",
										},
										purple: {
											bg: "bg-purple-50",
											text: "text-purple-700",
											border: "border-purple-200",
											icon: "text-purple-600",
										},
									};
									const colors = colorClasses[item.color];

									return (
										<div
											key={index}
											className={`p-4 ${colors.bg} border ${colors.border} rounded-xl`}
										>
											<div className="flex items-start gap-3">
												<div
													className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center`}
												>
													<Icon
														className={`w-5 h-5 ${colors.icon}`}
													/>
												</div>
												<div className="flex-1">
													<div className="flex items-start justify-between mb-1">
														<div>
															<p className="text-xs text-gray-500 uppercase tracking-wide">
																{item.type}
															</p>
															<h4 className="font-bold text-gray-800">
																{item.title}
															</h4>
														</div>
														<span
															className={`px-2 py-1 ${colors.bg} ${colors.text} text-xs font-semibold rounded-full`}
														>
															{item.status}
														</span>
													</div>
													<p className="text-sm text-gray-600">
														{item.description}
													</p>
												</div>
											</div>
										</div>
									);
								})}
							</div>

							{/* AI Wellness Suggestion - Special Card */}
							{latestPrescription?.aiSuggestion && (
								<div className="mt-6 relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-[2px] shadow-xl">
									<div className="bg-white rounded-2xl p-5 relative">
										<div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-30 -mr-16 -mt-16"></div>
										<div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-200 to-purple-200 rounded-full opacity-30 -ml-12 -mb-12"></div>

										<div className="relative">
											<div className="flex items-center gap-2 mb-3">
												<div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
													<Sparkles className="w-5 h-5 text-white animate-pulse" />
												</div>
												<div>
													<p className="text-xs font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 uppercase tracking-wide">
														Wellness Suggestion
													</p>
													<h4 className="font-bold text-gray-800">
														Personalized Care Tips
													</h4>
												</div>
											</div>

											<p className="text-sm text-gray-700 leading-relaxed italic">
												"
												{
													latestPrescription.aiSuggestion
												}
												"
											</p>

											<div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
												<Sparkles className="w-3 h-3" />
												<span>
													Generated based on your
													prescription
												</span>
											</div>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
