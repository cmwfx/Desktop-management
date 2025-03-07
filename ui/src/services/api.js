import axios from "axios";

// Create an axios instance with default config
const api = axios.create({
	baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
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

export default api;
