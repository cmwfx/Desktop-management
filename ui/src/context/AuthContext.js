import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Check if user is logged in
		const token = localStorage.getItem("token");
		const userRole = localStorage.getItem("userRole");

		if (token) {
			// In a real app, you would verify the token with your backend
			setUser({ role: userRole });
			setIsAuthenticated(true);
		}

		setLoading(false);
	}, []);

	// Login function
	const login = (token, role) => {
		localStorage.setItem("token", token);
		localStorage.setItem("userRole", role);
		setUser({ role });
		setIsAuthenticated(true);
	};

	// Logout function
	const logout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("userRole");
		setUser(null);
		setIsAuthenticated(false);
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				isAuthenticated,
				loading,
				login,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
