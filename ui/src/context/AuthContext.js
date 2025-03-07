import React, { createContext, useState, useEffect } from "react";
import * as authService from "../services/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [loading, setLoading] = useState(true);
	const [userRole, setUserRole] = useState(null);

	useEffect(() => {
		// Check if user is logged in
		const token = localStorage.getItem("token");

		if (token) {
			// Fetch user data from backend
			const fetchUser = async () => {
				try {
					const userData = await authService.getCurrentUser();
					if (userData.success) {
						setUser(userData.data);
						setIsAuthenticated(true);
						setUserRole(userData.data.role);
					} else {
						// Token is invalid
						localStorage.removeItem("token");
						setUser(null);
						setIsAuthenticated(false);
						setUserRole(null);
					}
				} catch (error) {
					console.error("Error fetching user data:", error);
					localStorage.removeItem("token");
					setUser(null);
					setIsAuthenticated(false);
					setUserRole(null);
				} finally {
					setLoading(false);
				}
			};

			fetchUser();
		} else {
			// No token found
			setUser(null);
			setIsAuthenticated(false);
			setUserRole(null);
			setLoading(false);
		}
	}, []);

	// Register a new user
	const register = async (userData) => {
		try {
			const response = await authService.register(userData);

			if (response.success) {
				// Store token
				localStorage.setItem("token", response.token);

				// Set user data
				setUser(response.user);
				setIsAuthenticated(true);
				setUserRole(response.user.role);

				return response.user;
			}
		} catch (error) {
			throw error;
		}
	};

	// Login a user
	const login = async (credentials) => {
		try {
			const response = await authService.login(credentials);

			if (response.success) {
				// Store token
				localStorage.setItem("token", response.token);

				// Set user data
				setUser(response.user);
				setIsAuthenticated(true);
				setUserRole(response.user.role);

				return response.user;
			}
		} catch (error) {
			throw error;
		}
	};

	// Logout a user
	const logout = async () => {
		try {
			// Remove token
			localStorage.removeItem("token");

			// Clear user data
			setUser(null);
			setIsAuthenticated(false);
			setUserRole(null);
		} catch (error) {
			throw error;
		}
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				isAuthenticated,
				loading,
				userRole,
				register,
				login,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
