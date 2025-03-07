import api from "./api";

// Get all transactions (admin only)
export const getAllTransactions = async () => {
	try {
		const response = await api.get("/transactions");
		return response.data;
	} catch (error) {
		throw (
			error.response?.data || {
				success: false,
				message: "Failed to get transactions",
			}
		);
	}
};

// Get current user's transactions
export const getMyTransactions = async () => {
	try {
		const response = await api.get("/transactions/me");
		return response.data;
	} catch (error) {
		throw (
			error.response?.data || {
				success: false,
				message: "Failed to get transactions",
			}
		);
	}
};

// Create a deposit transaction (admin only)
export const createDeposit = async (depositData) => {
	try {
		const response = await api.post("/transactions/deposit", depositData);
		return response.data;
	} catch (error) {
		throw (
			error.response?.data || {
				success: false,
				message: "Failed to create deposit",
			}
		);
	}
};
