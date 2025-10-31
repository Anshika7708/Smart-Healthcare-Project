import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	User,
	Mail,
	Phone,
	Calendar,
	Users,
	Heart,
	QrCode,
	Edit2,
	Save,
	X,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";
import { getUserProfile, updateUserProfile } from "../api/api";

const Profile = () => {
	const { user } = useContext(AuthContext);
	const navigate = useNavigate();
	const [profile, setProfile] = useState(null);
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState({});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!user) {
			navigate("/login");
			return;
		}

		const fetchProfile = async () => {
			try {
				const response = await getUserProfile(user._id);
				setProfile(response.data);
				setFormData(response.data);
			} catch (error) {
				console.error("Error fetching profile:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchProfile();
	}, [user, navigate]);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSave = async () => {
		try {
			const response = await updateUserProfile(user._id, formData);
			setProfile(response.data.user);
			setIsEditing(false);
		} catch (error) {
			console.error("Error updating profile:", error);
		}
	};

	const handleCancel = () => {
		setFormData(profile);
		setIsEditing(false);
	};

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

			<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Header */}
				<div className="mb-8 flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold text-gray-800 mb-2">
							My Profile
						</h1>
						<p className="text-gray-600">
							Manage your personal information
						</p>
					</div>
					{!isEditing ? (
						<button
							onClick={() => setIsEditing(true)}
							className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
						>
							<Edit2 className="w-5 h-5" />
							Edit Profile
						</button>
					) : (
						<div className="flex gap-2">
							<button
								onClick={handleSave}
								className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
							>
								<Save className="w-5 h-5" />
								Save
							</button>
							<button
								onClick={handleCancel}
								className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-200"
							>
								<X className="w-5 h-5" />
								Cancel
							</button>
						</div>
					)}
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* QR Code Card */}
					<div className="lg:col-span-1">
						<div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
							<div className="text-center">
								<div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mx-auto mb-4 flex items-center justify-center">
									<User className="w-10 h-10 text-white" />
								</div>
								<h2 className="text-xl font-bold text-gray-800 mb-1">
									{profile?.fullName}
								</h2>
								<p className="text-gray-600 text-sm mb-6">
									{profile?.email}
								</p>

								<div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-2xl mb-4">
									{profile?.qrCode ? (
										<img
											src={profile.qrCode}
											alt="QR Code"
											className="w-full rounded-xl shadow-md"
										/>
									) : (
										<div className="w-full h-48 bg-gray-200 rounded-xl flex items-center justify-center">
											<QrCode className="w-12 h-12 text-gray-400" />
										</div>
									)}
								</div>
								<p className="text-xs text-gray-500">
									Scan to view profile
								</p>
							</div>
						</div>
					</div>

					{/* Profile Details */}
					<div className="lg:col-span-2">
						<div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
							<h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
								<Heart className="w-6 h-6 text-indigo-600" />
								Personal Information
							</h3>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
								{/* Full Name */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Full Name
									</label>
									<div className="relative">
										<User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
										<input
											type="text"
											name="fullName"
											value={formData.fullName || ""}
											onChange={handleChange}
											disabled={!isEditing}
											className={`w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl transition-all duration-200 outline-none ${
												isEditing
													? "focus:ring-2 focus:ring-indigo-500 focus:border-transparent hover:border-indigo-300"
													: "bg-gray-50 cursor-not-allowed"
											}`}
										/>
									</div>
								</div>

								{/* Age */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Age
									</label>
									<div className="relative">
										<Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
										<input
											type="number"
											name="age"
											value={formData.age || ""}
											onChange={handleChange}
											disabled={!isEditing}
											className={`w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl transition-all duration-200 outline-none ${
												isEditing
													? "focus:ring-2 focus:ring-indigo-500 focus:border-transparent hover:border-indigo-300"
													: "bg-gray-50 cursor-not-allowed"
											}`}
										/>
									</div>
								</div>

								{/* Gender */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Gender
									</label>
									<select
										name="gender"
										value={formData.gender || ""}
										onChange={handleChange}
										disabled={!isEditing}
										className={`w-full px-4 py-3 border border-gray-300 rounded-xl transition-all duration-200 outline-none ${
											isEditing
												? "focus:ring-2 focus:ring-indigo-500 focus:border-transparent hover:border-indigo-300"
												: "bg-gray-50 cursor-not-allowed"
										}`}
									>
										<option value="Male">Male</option>
										<option value="Female">Female</option>
										<option value="Other">Other</option>
									</select>
								</div>

								{/* Marital Status */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Marital Status
									</label>
									<select
										name="maritalStatus"
										value={
											formData.maritalStatus || "Single"
										}
										onChange={handleChange}
										disabled={!isEditing}
										className={`w-full px-4 py-3 border border-gray-300 rounded-xl transition-all duration-200 outline-none ${
											isEditing
												? "focus:ring-2 focus:ring-indigo-500 focus:border-transparent hover:border-indigo-300"
												: "bg-gray-50 cursor-not-allowed"
										}`}
									>
										<option value="Single">Single</option>
										<option value="Married">Married</option>
										<option value="Divorced">
											Divorced
										</option>
										<option value="Widowed">Widowed</option>
									</select>
								</div>

								{/* Contact */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Contact Number
									</label>
									<div className="relative">
										<Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
										<input
											type="tel"
											name="contact"
											value={formData.contact || ""}
											onChange={handleChange}
											disabled={!isEditing}
											className={`w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl transition-all duration-200 outline-none ${
												isEditing
													? "focus:ring-2 focus:ring-indigo-500 focus:border-transparent hover:border-indigo-300"
													: "bg-gray-50 cursor-not-allowed"
											}`}
										/>
									</div>
								</div>

								{/* Email */}
								<div className="sm:col-span-2">
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Email
									</label>
									<div className="relative">
										<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
										<input
											type="email"
											value={formData.email || ""}
											disabled
											className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl bg-gray-50 cursor-not-allowed"
										/>
									</div>
									<p className="text-xs text-gray-500 mt-1">
										Email cannot be changed
									</p>
								</div>

								{/* Emergency Contact */}
								<div className="sm:col-span-2">
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Emergency Contact
									</label>
									<div className="relative">
										<Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
										<input
											type="tel"
											name="emergencyContact"
											value={
												formData.emergencyContact || ""
											}
											onChange={handleChange}
											disabled={!isEditing}
											className={`w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl transition-all duration-200 outline-none ${
												isEditing
													? "focus:ring-2 focus:ring-indigo-500 focus:border-transparent hover:border-indigo-300"
													: "bg-gray-50 cursor-not-allowed"
											}`}
										/>
									</div>
								</div>

								{/* Medical History */}
								<div className="sm:col-span-2">
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Medical History
									</label>
									<textarea
										name="medicalHistory"
										value={formData.medicalHistory || ""}
										onChange={handleChange}
										disabled={!isEditing}
										rows="4"
										className={`w-full px-4 py-3 border border-gray-300 rounded-xl transition-all duration-200 outline-none resize-none ${
											isEditing
												? "focus:ring-2 focus:ring-indigo-500 focus:border-transparent hover:border-indigo-300"
												: "bg-gray-50 cursor-not-allowed"
										}`}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Profile;
