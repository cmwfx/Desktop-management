import api from "./api";

// Register a new user
export const register = async (userData) => {
	try {
		const response = await api.post("/users/register", userData);
		return response.data;
	} catch (error) {
		throw error.response.data;
	}
};

// Login a user
export const login = async (credentials) => {
	try {
		const response = await api.post("/users/login", credentials);
		return response.data;
	} catch (error) {
		throw error.response.data;
	}
};

// Get current user profile
export const getCurrentUser = async () => {
	try {
		const response = await api.get("/users/me");
		return response.data;
	} catch (error) {
		throw error.response.data;
	}
};

// Update user's balance
export const updateBalance = async (userId, amount) => {
	try {
		const response = await api.put(`/users/${userId}/balance`, { amount });
		return response.data;
	} catch (error) {
		throw error.response.data;
	}
};
