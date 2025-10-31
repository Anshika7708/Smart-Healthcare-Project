import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn, Sparkles } from "lucide-react";
import { login } from "../api/api";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
	const [formData, setFormData] = useState({
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
			const response = await login(formData);
			loginUser(response.data.user, response.data.token);
			navigate("/dashboard");
		} catch (err) {
			setError(
				err.response?.data?.message || "Login failed. Please try again."
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
			<div className="w-full max-w-md">
				{/* Header */}
				<div className="text-center mb-8 animate-fade-in">
					<div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg transform hover:scale-110 transition-transform duration-300">
						<Sparkles className="w-8 h-8 text-white" />
					</div>
					<h1 className="text-3xl font-bold text-gray-800 mb-2">
						Welcome Back
					</h1>
					<p className="text-gray-600">
						Sign in to access your health portal
					</p>
				</div>

				{/* Login Card */}
				<div className="bg-white rounded-3xl shadow-xl p-8 transform hover:shadow-2xl transition-shadow duration-300">
					{error && (
						<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 animate-shake">
							{error}
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Email Input */}
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

						{/* Password Input */}
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
									className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 outline-none hover:border-indigo-300"
									placeholder="••••••••"
								/>
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
									<LogIn className="w-5 h-5" />
									Sign In
								</>
							)}
						</button>
					</form>

					{/* Signup Link */}
					<div className="mt-6 text-center">
						<p className="text-gray-600">
							Don't have an account?{" "}
							<Link
								to="/signup"
								className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
							>
								Sign Up
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
