import axios from "axios";
import { ADMIN_API_URL } from "../config";

// Create an axios instance with default config
const api = axios.create({
	baseURL: ADMIN_API_URL + "/api",
	headers: {
		"Content-Type": "application/json",
	},
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
	(config) => {
		// Get token from Firebase Auth
		const token = localStorage.getItem("token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response && error.response.status === 401) {
			// Token expired or invalid
			localStorage.removeItem("token");
			localStorage.removeItem("userRole");
			window.location.href = "/login";
		}
		return Promise.reject(error);
	}
);

// Helper function for password change
export const changePassword = async (clientIP, username, newPassword) => {
	try {
		const response = await api.post("/change-password", {
			clientIP,
			username,
			newPassword,
		});
		return response.data;
	} catch (error) {
		throw (
			error.response?.data || {
				success: false,
				message: "Failed to change password",
			}
		);
	}
};

// Helper function for locking PC
export const lockPC = async (clientIP, username) => {
	try {
		const response = await api.post("/lock-pc", {
			clientIP,
			username,
		});
		return response.data;
	} catch (error) {
		throw (
			error.response?.data || { success: false, message: "Failed to lock PC" }
		);
	}
};

export default api;
