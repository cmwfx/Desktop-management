const Session = require("../models/Session");
const Computer = require("../models/Computer");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const crypto = require("crypto");

// Helper function to generate a random password
const generatePassword = () => {
	return "temp-" + Math.floor(1000 + Math.random() * 9000);
};

// @desc    Create new session (purchase time)
// @route   POST /api/sessions
// @access  Private
exports.createSession = async (req, res) => {
	try {
		const { computerId, duration } = req.body;

		if (!computerId || !duration) {
			return res.status(400).json({
				success: false,
				message: "Please provide computer ID and duration",
			});
		}

		// Find computer
		const computer = await Computer.findById(computerId);

		if (!computer) {
			return res.status(404).json({
				success: false,
				message: "Computer not found",
			});
		}

		// Check if computer is available
		if (computer.status !== "available") {
			return res.status(400).json({
				success: false,
				message: "Computer is not available",
			});
		}

		// Calculate cost (duration in minutes * price per hour / 60)
		const cost = (duration * computer.pricePerHour) / 60;

		// Find user
		const user = await User.findById(req.user.id);

		// Check if user has enough balance
		if (user.balance < cost) {
			return res.status(400).json({
				success: false,
				message: "Insufficient balance",
			});
		}

		// Generate temporary password
		const temporaryPassword = generatePassword();

		// Calculate end time
		const endTime = new Date();
		endTime.setMinutes(endTime.getMinutes() + duration);

		// Create session
		const session = await Session.create({
			userId: req.user.id,
			computerId: computer._id,
			duration,
			cost,
			temporaryPassword,
			endTime,
		});

		// Update computer status
		computer.status = "in-use";
		computer.assignedUser = req.user.id;
		computer.currentPassword = temporaryPassword;
		computer.expiryTimestamp = endTime;
		await computer.save();

		// Update user balance and active session
		user.balance -= cost;
		user.activeSession = session._id;
		await user.save();

		// Create transaction record
		await Transaction.create({
			userId: req.user.id,
			amount: -cost,
			transactionType: "purchase",
			paymentMethod: "system",
			description: `Session purchase for Computer #${computer.computerNumber}`,
			sessionId: session._id,
		});

		// Send command to MeshCentral to change computer password
		if (computer.meshCentralId) {
			try {
				// Import the meshcentral controller
				const meshcentral = require("./meshcentral");

				// Change password on the client PC
				await meshcentral.changePassword({
					clientIP: computer.meshCentralId,
					username: "user", // Default username or get from computer config
					newPassword: temporaryPassword,
				});

				// Set up a timer to lock the computer when the session expires
				setTimeout(async () => {
					try {
						await meshcentral.lockPC({
							clientIP: computer.meshCentralId,
							username: "user", // Default username or get from computer config
						});

						// Update session status
						session.sessionStatus = "expired";
						await session.save();

						// Update computer status
						computer.status = "available";
						computer.assignedUser = null;
						computer.currentPassword = null;
						computer.expiryTimestamp = null;
						await computer.save();

						// Update user's active session
						if (
							user.activeSession &&
							user.activeSession.toString() === session._id.toString()
						) {
							user.activeSession = null;
							await user.save();
						}
					} catch (error) {
						console.error(
							"Error locking computer after session expiry:",
							error
						);
					}
				}, duration * 60 * 1000); // Convert minutes to milliseconds
			} catch (error) {
				console.error("Error changing password via MeshCentral:", error);
				// Continue with session creation even if MeshCentral integration fails
			}
		}

		res.status(201).json({
			success: true,
			data: {
				session,
				computer: {
					id: computer._id,
					computerNumber: computer.computerNumber,
					temporaryPassword,
				},
			},
		});
	} catch (err) {
		res.status(400).json({
			success: false,
			message: err.message,
		});
	}
};

// @desc    Get all sessions
// @route   GET /api/sessions
// @access  Private/Admin
exports.getSessions = async (req, res) => {
	try {
		const sessions = await Session.find()
			.populate("userId", "username email")
			.populate("computerId", "computerNumber");

		res.status(200).json({
			success: true,
			count: sessions.length,
			data: sessions,
		});
	} catch (err) {
		res.status(400).json({
			success: false,
			message: err.message,
		});
	}
};

// @desc    Get user's active session
// @route   GET /api/sessions/me
// @access  Private
exports.getMySession = async (req, res) => {
	try {
		const user = await User.findById(req.user.id).populate("activeSession");

		if (!user.activeSession) {
			return res.status(404).json({
				success: false,
				message: "No active session found",
			});
		}

		const session = await Session.findById(user.activeSession).populate(
			"computerId",
			"computerNumber"
		);

		res.status(200).json({
			success: true,
			data: session,
		});
	} catch (err) {
		res.status(400).json({
			success: false,
			message: err.message,
		});
	}
};

// @desc    End session
// @route   PUT /api/sessions/:id/end
// @access  Private/Admin
exports.endSession = async (req, res) => {
	try {
		const session = await Session.findById(req.params.id);

		if (!session) {
			return res.status(404).json({
				success: false,
				message: "Session not found",
			});
		}

		// Update session status
		session.sessionStatus = "terminated";
		await session.save();

		// Update computer status
		const computer = await Computer.findById(session.computerId);
		computer.status = "available";
		computer.assignedUser = null;
		computer.currentPassword = null;
		computer.expiryTimestamp = null;
		await computer.save();

		// Update user's active session
		const user = await User.findById(session.userId);
		if (
			user.activeSession &&
			user.activeSession.toString() === session._id.toString()
		) {
			user.activeSession = null;
			await user.save();
		}

		// Send command to MeshCentral to lock computer
		if (computer.meshCentralId) {
			try {
				// Import the meshcentral controller
				const meshcentral = require("./meshcentral");

				// Lock the client PC
				await meshcentral.lockPC({
					clientIP: computer.meshCentralId,
					username: "user", // Default username or get from computer config
				});
			} catch (error) {
				console.error("Error locking computer via MeshCentral:", error);
				// Continue with session termination even if MeshCentral integration fails
			}
		}

		res.status(200).json({
			success: true,
			data: session,
		});
	} catch (err) {
		res.status(400).json({
			success: false,
			message: err.message,
		});
	}
};
