import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { useContext } from "react";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Reports from "./pages/Reports";
import Vitals from "./pages/Vitals";
import Prescription from "./pages/Prescription";
import PatientView from "./pages/PatientView";

const ProtectedRoute = ({ children }) => {
	const { user, loading } = useContext(AuthContext);

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
				<div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
			</div>
		);
	}

	return user ? children : <Navigate to="/login" />;
};

function AppRoutes() {
	const { user } = useContext(AuthContext);

	return (
		<Router>
			<Routes>
				<Route
					path="/login"
					element={user ? <Navigate to="/dashboard" /> : <Login />}
				/>
				<Route
					path="/signup"
					element={user ? <Navigate to="/dashboard" /> : <Signup />}
				/>
				<Route path="/patient/:id" element={<PatientView />} />
				<Route
					path="/dashboard"
					element={
						<ProtectedRoute>
							<Dashboard />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/profile"
					element={
						<ProtectedRoute>
							<Profile />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/reports"
					element={
						<ProtectedRoute>
							<Reports />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/vitals"
					element={
						<ProtectedRoute>
							<Vitals />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/prescription"
					element={
						<ProtectedRoute>
							<Prescription />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/"
					element={<Navigate to={user ? "/dashboard" : "/login"} />}
				/>
			</Routes>
		</Router>
	);
}

function App() {
	return (
		<AuthProvider>
			<AppRoutes />
		</AuthProvider>
	);
}

export default App;
