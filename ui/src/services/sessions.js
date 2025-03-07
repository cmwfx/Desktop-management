import api from "./api";

// Create a new session (purchase time)
export const createSession = async (sessionData) => {
	try {
		const response = await api.post("/sessions", sessionData);
		return response.data;
	} catch (error) {
		throw (
			error.response?.data || {
				success: false,
				message: "Failed to create session",
			}
		);
	}
};

// Get all sessions (admin only)
export const getAllSessions = async () => {
	try {
		const response = await api.get("/sessions");
		return response.data;
	} catch (error) {
		throw (
			error.response?.data || {
				success: false,
				message: "Failed to get sessions",
			}
		);
	}
};

// Get current user's active session
export const getMySession = async () => {
	try {
		const response = await api.get("/sessions/me");
		return response.data;
	} catch (error) {
		if (error.response?.status === 404) {
			return { success: false, data: null };
		}
		throw (
			error.response?.data || {
				success: false,
				message: "Failed to get session",
			}
		);
	}
};

// End a session (admin only)
export const endSession = async (id) => {
	try {
		const response = await api.put(`/sessions/${id}/end`);
		return response.data;
	} catch (error) {
		throw (
			error.response?.data || {
				success: false,
				message: "Failed to end session",
			}
		);
	}
};
