import { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
	LayoutDashboard,
	User,
	FileText,
	Activity,
	LogOut,
	Heart,
	Stethoscope,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
	const { user, logoutUser } = useContext(AuthContext);
	const location = useLocation();
	const navigate = useNavigate();

	const handleLogout = () => {
		logoutUser();
		navigate("/login");
	};

	const isActive = (path) => location.pathname === path;

	const navItems = [
		{ path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
		{ path: "/profile", icon: User, label: "Profile" },
		{ path: "/reports", icon: FileText, label: "Reports" },
		{ path: "/vitals", icon: Activity, label: "Vitals" },
		{ path: "/prescription", icon: Stethoscope, label: "Prescription" },
	];

	return (
		<nav className="bg-white shadow-lg sticky top-0 z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					{/* Logo */}
					<Link
						to="/dashboard"
						className="flex items-center gap-2 group"
					>
						<div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transform group-hover:scale-105 transition-all duration-200">
							<Heart className="w-6 h-6 text-white" />
						</div>
						<span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
							SmartHealth
						</span>
					</Link>

					{/* Navigation Links */}
					<div className="hidden md:flex items-center gap-1">
						{navItems.map((item) => {
							const Icon = item.icon;
							const active = isActive(item.path);
							return (
								<Link
									key={item.path}
									to={item.path}
									className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
										active
											? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md"
											: "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
									}`}
								>
									<Icon className="w-5 h-5" />
									<span>{item.label}</span>
								</Link>
							);
						})}
					</div>

					{/* User Menu */}
					<div className="flex items-center gap-4">
						<div className="hidden sm:block text-right">
							<p className="text-sm font-semibold text-gray-800">
								{user?.fullName}
							</p>
							<p className="text-xs text-gray-500">
								{user?.email}
							</p>
						</div>
						<button
							onClick={handleLogout}
							className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-all duration-200 transform hover:scale-105"
						>
							<LogOut className="w-5 h-5" />
							<span className="hidden sm:inline">Logout</span>
						</button>
					</div>
				</div>

				{/* Mobile Navigation */}
				<div className="md:hidden flex gap-1 pb-3 overflow-x-auto">
					{navItems.map((item) => {
						const Icon = item.icon;
						const active = isActive(item.path);
						return (
							<Link
								key={item.path}
								to={item.path}
								className={`flex items-center gap-2 px-3 py-2 rounded-xl font-medium whitespace-nowrap transition-all duration-200 ${
									active
										? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md"
										: "text-gray-600 hover:bg-gray-100"
								}`}
							>
								<Icon className="w-4 h-4" />
								<span className="text-sm">{item.label}</span>
							</Link>
						);
					})}
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
