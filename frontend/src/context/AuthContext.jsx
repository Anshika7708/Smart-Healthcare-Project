import { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext();

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [token, setToken] = useState(localStorage.getItem("token"));
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const storedUser = localStorage.getItem("user");
		const storedToken = localStorage.getItem("token");

		if (storedUser && storedToken) {
			setUser(JSON.parse(storedUser));
			setToken(storedToken);
		}
		setLoading(false);
	}, []);

	const loginUser = (userData, authToken) => {
		setUser(userData);
		setToken(authToken);
		localStorage.setItem("user", JSON.stringify(userData));
		localStorage.setItem("token", authToken);
	};

	const logoutUser = () => {
		setUser(null);
		setToken(null);
		localStorage.removeItem("user");
		localStorage.removeItem("token");
	};

	return (
		<AuthContext.Provider
			value={{ user, token, loginUser, logoutUser, loading }}
		>
			{children}
		</AuthContext.Provider>
	);
};
