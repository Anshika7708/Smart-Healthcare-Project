import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
	User,
	Mail,
	Lock,
	Phone,
	Heart,
	Users,
	Calendar,
	UserPlus,
} from "lucide-react";
import { signup, initializeSampleVitals } from "../api/api";
import { AuthContext } from "../context/AuthContext";

const Signup = () => {
	const [formData, setFormData] = useState({
		fullName: "",
		age: "",
		gender: "Male",
		maritalStatus: "Single",
		contact: "",
		medicalHistory: "",
		emergencyContact: "",
		email: "",
		password: "",
	});
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const { loginUser } = useContext(AuthContext);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			const response = await signup(formData);
			loginUser(response.data.user, response.data.token);

			// Initialize sample vitals for new user
			await initializeSampleVitals(response.data.user._id);

			navigate("/dashboard");
		} catch (err) {
			setError(
				err.response?.data?.message ||
					"Signup failed. Please try again."
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 py-12">
			<div className="w-full max-w-2xl">
				{/* Header */}
				<div className="text-center mb-8 animate-fade-in">
					<div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg transform hover:scale-110 transition-transform duration-300">
						<Heart className="w-8 h-8 text-white" />
					</div>
					<h1 className="text-3xl font-bold text-gray-800 mb-2">
						Create Account
					</h1>
					<p className="text-gray-600">
						Join Smart Healthcare Portal
					</p>
				</div>

				{/* Signup Card */}
				<div className="bg-white rounded-3xl shadow-xl p-8 transform hover:shadow-2xl transition-shadow duration-300">
					{error && (
						<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 animate-shake">
							{error}
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Two Column Grid */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{/* Full Name */}
							<div className="group">
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Full Name
								</label>
								<div className="relative">
									<User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
									<input
										type="text"
										name="fullName"
										value={formData.fullName}
										onChange={handleChange}
										required
										className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 outline-none hover:border-indigo-300"
										placeholder="John Doe"
									/>
								</div>
							</div>

							{/* Age */}
							<div className="group">
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Age
								</label>
								<div className="relative">
									<Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
									<input
										type="number"
										name="age"
										value={formData.age}
										onChange={handleChange}
										required
										min="0"
										max="150"
										className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 outline-none hover:border-indigo-300"
										placeholder="25"
									/>
								</div>
							</div>

							{/* Gender */}
							<div className="group">
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Gender
								</label>
								<select
									name="gender"
									value={formData.gender}
									onChange={handleChange}
									required
									className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 outline-none hover:border-indigo-300"
								>
									<option value="Male">Male</option>
									<option value="Female">Female</option>
									<option value="Other">Other</option>
								</select>
							</div>

							{/* Marital Status */}
							<div className="group">
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Marital Status
								</label>
								<select
									name="maritalStatus"
									value={formData.maritalStatus}
									onChange={handleChange}
									required
									className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 outline-none hover:border-indigo-300"
								>
									<option value="Single">Single</option>
									<option value="Married">Married</option>
									<option value="Divorced">Divorced</option>
									<option value="Widowed">Widowed</option>
								</select>
							</div>

							{/* Contact */}
							<div className="group">
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Contact Number
								</label>
								<div className="relative">
									<Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
									<input
										type="tel"
										name="contact"
										value={formData.contact}
										onChange={handleChange}
										required
										className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 outline-none hover:border-indigo-300"
										placeholder="+1 234 567 8900"
									/>
								</div>
							</div>

							{/* Emergency Contact */}
							<div className="group">
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Emergency Contact
								</label>
								<div className="relative">
									<Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
									<input
										type="tel"
										name="emergencyContact"
										value={formData.emergencyContact}
										onChange={handleChange}
										required
										className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 outline-none hover:border-indigo-300"
										placeholder="+1 234 567 8900"
									/>
								</div>
							</div>

							{/* Medical History */}
							<div className="group md:col-span-2">
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Medical History (Allergies/Past Diseases)
								</label>
								<textarea
									name="medicalHistory"
									value={formData.medicalHistory}
									onChange={handleChange}
									rows="3"
									className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 outline-none hover:border-indigo-300 resize-none"
									placeholder="Any allergies, past diseases, or medical conditions..."
								/>
							</div>

							{/* Email */}
							<div className="group">
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Email Address
								</label>
								<div className="relative">
									<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
									<input
										type="email"
										name="email"
										value={formData.email}
										onChange={handleChange}
										required
										className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 outline-none hover:border-indigo-300"
										placeholder="you@example.com"
									/>
								</div>
							</div>

							{/* Password */}
							<div className="group">
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Password
								</label>
								<div className="relative">
									<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
									<input
										type="password"
										name="password"
										value={formData.password}
										onChange={handleChange}
										required
										minLength="6"
										className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 outline-none hover:border-indigo-300"
										placeholder="••••••••"
									/>
								</div>
							</div>
						</div>

						{/* Submit Button */}
						<button
							type="submit"
							disabled={loading}
							className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
						>
							{loading ? (
								<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
							) : (
								<>
									<UserPlus className="w-5 h-5" />
									Create Account
								</>
							)}
						</button>
					</form>

					{/* Login Link */}
					<div className="mt-6 text-center">
						<p className="text-gray-600">
							Already have an account?{" "}
							<Link
								to="/login"
								className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
							>
								Sign In
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Signup;
