import api from "./api";

// Get all computers
export const getAllComputers = async () => {
	try {
		const response = await api.get("/computers");
		return response.data;
	} catch (error) {
		throw (
			error.response?.data || {
				success: false,
				message: "Failed to get computers",
			}
		);
	}
};

// Get a single computer
export const getComputer = async (id) => {
	try {
		const response = await api.get(`/computers/${id}`);
		return response.data;
	} catch (error) {
		throw (
			error.response?.data || {
				success: false,
				message: "Failed to get computer",
			}
		);
	}
};

// Create a new computer (admin only)
export const createComputer = async (computerData) => {
	try {
		const response = await api.post("/computers", computerData);
		return response.data;
	} catch (error) {
		throw (
			error.response?.data || {
				success: false,
				message: "Failed to create computer",
			}
		);
	}
};

// Update a computer (admin only)
export const updateComputer = async (id, computerData) => {
	try {
		const response = await api.put(`/computers/${id}`, computerData);
		return response.data;
	} catch (error) {
		throw (
			error.response?.data || {
				success: false,
				message: "Failed to update computer",
			}
		);
	}
};

// Delete a computer (admin only)
export const deleteComputer = async (id) => {
	try {
		const response = await api.delete(`/computers/${id}`);
		return response.data;
	} catch (error) {
		throw (
			error.response?.data || {
				success: false,
				message: "Failed to delete computer",
			}
		);
	}
};
