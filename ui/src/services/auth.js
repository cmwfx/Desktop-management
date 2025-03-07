import api from "./api";

// Register a new user
export const register = async (userData) => {
	try {
		const response = await api.post("/users/register", userData);
		return response.data;
	} catch (error) {
		throw (
			error.response?.data || { success: false, message: "Registration failed" }
		);
	}
};

// Login a user
export const login = async (credentials) => {
	try {
		const response = await api.post("/users/login", credentials);
		return response.data;
	} catch (error) {
		throw error.response?.data || { success: false, message: "Login failed" };
	}
};

// Get current user profile
export const getCurrentUser = async () => {
	try {
		const response = await api.get("/users/me");
		return response.data;
	} catch (error) {
		throw (
			error.response?.data || {
				success: false,
				message: "Failed to get user data",
			}
		);
	}
};

// Update user's balance (admin only)
export const updateBalance = async (userId, amount) => {
	try {
		const response = await api.put(`/users/${userId}/balance`, { amount });
		return response.data;
	} catch (error) {
		throw (
			error.response?.data || {
				success: false,
				message: "Failed to update balance",
			}
		);
	}
};

// Get all users (admin only)
export const getAllUsers = async () => {
	try {
		const response = await api.get("/users");
		return response.data;
	} catch (error) {
		throw (
			error.response?.data || { success: false, message: "Failed to get users" }
		);
	}
};
