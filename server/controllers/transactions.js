const Transaction = require("../models/Transaction");
const User = require("../models/User");

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Private/Admin
exports.getTransactions = async (req, res) => {
	try {
		const transactions = await Transaction.find()
			.populate("userId", "username email")
			.populate("processedBy", "username email")
			.populate("sessionId");

		res.status(200).json({
			success: true,
			count: transactions.length,
			data: transactions,
		});
	} catch (err) {
		res.status(400).json({
			success: false,
			message: err.message,
		});
	}
};

// @desc    Get user transactions
// @route   GET /api/transactions/me
// @access  Private
exports.getMyTransactions = async (req, res) => {
	try {
		const transactions = await Transaction.find({ userId: req.user.id })
			.populate("processedBy", "username email")
			.populate("sessionId");

		res.status(200).json({
			success: true,
			count: transactions.length,
			data: transactions,
		});
	} catch (err) {
		res.status(400).json({
			success: false,
			message: err.message,
		});
	}
};

// @desc    Create new deposit transaction
// @route   POST /api/transactions/deposit
// @access  Private/Admin
exports.createDeposit = async (req, res) => {
	try {
		const { userId, amount, paymentMethod, description } = req.body;

		if (!userId || !amount) {
			return res.status(400).json({
				success: false,
				message: "Please provide user ID and amount",
			});
		}

		// Find user
		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		// Create transaction
		const transaction = await Transaction.create({
			userId,
			amount: parseFloat(amount),
			transactionType: "deposit",
			paymentMethod: paymentMethod || "cash",
			description: description || "Deposit",
			processedBy: req.user.id,
		});

		// Update user balance
		user.balance += parseFloat(amount);
		await user.save();

		res.status(201).json({
			success: true,
			data: {
				transaction,
				user: {
					id: user._id,
					username: user.username,
					balance: user.balance,
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
