import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
	User,
	Mail,
	Phone,
	Calendar,
	Users,
	Heart,
	FileText,
	Activity,
} from "lucide-react";
import { getUserProfile, getUserReports, getUserVitals } from "../api/api";

const PatientView = () => {
	const { id } = useParams();
	const [patient, setPatient] = useState(null);
	const [reports, setReports] = useState([]);
	const [vitals, setVitals] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchPatientData = async () => {
			try {
				const [profileRes, reportsRes, vitalsRes] = await Promise.all([
					getUserProfile(id),
					getUserReports(id),
					getUserVitals(id),
				]);
				setPatient(profileRes.data);
				setReports(reportsRes.data);
				setVitals(vitalsRes.data);
			} catch (error) {
				console.error("Error fetching patient data:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchPatientData();
	}, [id]);

	if (loading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
				<div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
			</div>
		);
	}

	if (!patient) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-gray-800 mb-2">
						Patient Not Found
					</h1>
					<p className="text-gray-600">
						The requested patient profile does not exist.
					</p>
				</div>
			</div>
		);
	}

	const latestVital = vitals[0];

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
			<div className="max-w-5xl mx-auto">
				{/* Header */}
				<div className="text-center mb-8">
					<div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg">
						<Heart className="w-8 h-8 text-white" />
					</div>
					<h1 className="text-3xl font-bold text-gray-800 mb-2">
						Patient Health Profile
					</h1>
					<p className="text-gray-600">
						View-only access via QR code
					</p>
				</div>

				{/* Patient Info Card */}
				<div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
					<div className="flex items-center gap-6 mb-6">
						<div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
							<User className="w-10 h-10 text-white" />
						</div>
						<div>
							<h2 className="text-2xl font-bold text-gray-800">
								{patient.fullName}
							</h2>
							<p className="text-gray-600">
								{patient.gender}, {patient.age} years old
							</p>
						</div>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
						<div className="flex items-center gap-3">
							<Mail className="w-5 h-5 text-indigo-600" />
							<div>
								<p className="text-sm text-gray-500">Email</p>
								<p className="font-medium text-gray-800">
									{patient.email}
								</p>
							</div>
						</div>
						<div className="flex items-center gap-3">
							<Phone className="w-5 h-5 text-indigo-600" />
							<div>
								<p className="text-sm text-gray-500">Contact</p>
								<p className="font-medium text-gray-800">
									{patient.contact}
								</p>
							</div>
						</div>
						<div className="flex items-center gap-3">
							<Users className="w-5 h-5 text-indigo-600" />
							<div>
								<p className="text-sm text-gray-500">
									Emergency Contact
								</p>
								<p className="font-medium text-gray-800">
									{patient.emergencyContact}
								</p>
							</div>
						</div>
						<div className="flex items-center gap-3">
							<Calendar className="w-5 h-5 text-indigo-600" />
							<div>
								<p className="text-sm text-gray-500">
									Registered
								</p>
								<p className="font-medium text-gray-800">
									{new Date(
										patient.createdAt
									).toLocaleDateString()}
								</p>
							</div>
						</div>
					</div>

					{patient.medicalHistory && (
						<div className="mt-6 p-4 bg-blue-50 rounded-xl">
							<h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
								<Heart className="w-5 h-5 text-indigo-600" />
								Medical History
							</h3>
							<p className="text-gray-700">
								{patient.medicalHistory}
							</p>
						</div>
					)}
				</div>

				{/* Latest Vitals */}
				{latestVital && (
					<div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
						<h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
							<Activity className="w-6 h-6 text-indigo-600" />
							Latest Vitals
						</h3>
						<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
							<div className="text-center p-4 bg-red-50 rounded-xl">
								<Heart className="w-8 h-8 text-red-600 mx-auto mb-2" />
								<p className="text-sm text-gray-600">
									Heart Rate
								</p>
								<p className="text-2xl font-bold text-gray-800">
									{latestVital.heartRate}
								</p>
								<p className="text-xs text-gray-500">bpm</p>
							</div>
							<div className="text-center p-4 bg-blue-50 rounded-xl">
								<Activity className="w-8 h-8 text-blue-600 mx-auto mb-2" />
								<p className="text-sm text-gray-600">
									Blood Pressure
								</p>
								<p className="text-2xl font-bold text-gray-800">
									{latestVital.bloodPressure}
								</p>
								<p className="text-xs text-gray-500">mmHg</p>
							</div>
							<div className="text-center p-4 bg-green-50 rounded-xl">
								<Activity className="w-8 h-8 text-green-600 mx-auto mb-2" />
								<p className="text-sm text-gray-600">Oxygen</p>
								<p className="text-2xl font-bold text-gray-800">
									{latestVital.oxygenLevel}
								</p>
								<p className="text-xs text-gray-500">%</p>
							</div>
							<div className="text-center p-4 bg-orange-50 rounded-xl">
								<Activity className="w-8 h-8 text-orange-600 mx-auto mb-2" />
								<p className="text-sm text-gray-600">
									Temperature
								</p>
								<p className="text-2xl font-bold text-gray-800">
									{latestVital.temperature}
								</p>
								<p className="text-xs text-gray-500">°C</p>
							</div>
						</div>
					</div>
				)}

				{/* Reports */}
				<div className="bg-white rounded-2xl shadow-lg p-8">
					<h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
						<FileText className="w-6 h-6 text-indigo-600" />
						Medical Reports ({reports.length})
					</h3>
					{reports.length > 0 ? (
						<div className="space-y-3">
							{reports.slice(0, 5).map((report) => (
								<div
									key={report._id}
									className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
								>
									<div>
										<p className="font-medium text-gray-800">
											{report.fileName}
										</p>
										<p className="text-sm text-gray-600">
											{report.fileType} •{" "}
											{new Date(
												report.uploadDate
											).toLocaleDateString()}
										</p>
									</div>
									<span
										className={`px-3 py-1 rounded-lg text-xs font-medium ${
											report.fileType === "Report"
												? "bg-blue-100 text-blue-700"
												: "bg-purple-100 text-purple-700"
										}`}
									>
										{report.fileType}
									</span>
								</div>
							))}
						</div>
					) : (
						<p className="text-gray-500 text-center py-8">
							No reports available
						</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default PatientView;
