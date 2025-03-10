const axios = require("axios");

// MeshCentral configuration
const ADMIN_API_URL = "http://192.168.1.100:5000"; // Use your Admin PC's local IP

// @desc    Change password on a client PC
// @route   POST /api/change-password
// @access  Private
exports.changePassword = async (req, res) => {
	try {
		const { clientIP, username, newPassword } = req.body;

		if (!clientIP || !username || !newPassword) {
			return res.status(400).json({
				success: false,
				message: "Please provide clientIP, username, and newPassword",
			});
		}

		// Here you would implement the actual password change logic
		// This is a placeholder for the MeshCentral integration
		console.log(
			`Changing password for user ${username} on PC ${clientIP} to ${newPassword}`
		);

		// Example of how you might call a PowerShell script via MeshCentral
		// const command = `net user ${username} ${newPassword}`;
		// await sendRemoteCommand(clientIP, command);

		res.status(200).json({
			success: true,
			message: `Password changed for user ${username} on PC ${clientIP}`,
		});
	} catch (err) {
		console.error("Error changing password:", err);
		res.status(500).json({
			success: false,
			message: err.message || "Error changing password",
		});
	}
};

// @desc    Lock a client PC
// @route   POST /api/lock-pc
// @access  Private
exports.lockPC = async (req, res) => {
	try {
		const { clientIP, username } = req.body;

		if (!clientIP) {
			return res.status(400).json({
				success: false,
				message: "Please provide clientIP",
			});
		}

		// Here you would implement the actual PC locking logic
		// This is a placeholder for the MeshCentral integration
		console.log(`Locking PC ${clientIP} for user ${username || "unknown"}`);

		// Example of how you might call a PowerShell script via MeshCentral
		// const command = `rundll32.exe user32.dll,LockWorkStation`;
		// await sendRemoteCommand(clientIP, command);

		res.status(200).json({
			success: true,
			message: `PC ${clientIP} locked successfully`,
		});
	} catch (err) {
		console.error("Error locking PC:", err);
		res.status(500).json({
			success: false,
			message: err.message || "Error locking PC",
		});
	}
};

// Helper function to send remote commands via MeshCentral
async function sendRemoteCommand(computerId, command) {
	try {
		// This is a placeholder for the actual MeshCentral API call
		// You would replace this with your actual MeshCentral API integration
		const response = await axios.post(
			`${ADMIN_API_URL}/api/meshcentral/command`,
			{
				computerId,
				command,
			},
			{
				headers: {
					Authorization: `Bearer YOUR_MESHCENTRAL_API_TOKEN`,
				},
			}
		);

		return response.data;
	} catch (err) {
		console.error("Error sending remote command:", err);
		throw err;
	}
}
