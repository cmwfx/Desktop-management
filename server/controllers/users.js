const User = require("../models/User");

// @desc    Register user
// @route   POST /api/users/register
// @access  Public
exports.register = async (req, res) => {
	try {
		const { username, email, password } = req.body;

		// Check if user already exists
		const userExists = await User.findOne({ email });

		if (userExists) {
			return res.status(400).json({
				success: false,
				message: "User already exists",
			});
		}

		// Create user
		const user = await User.create({
			username,
			email,
			password,
		});

		// Generate token
		const token = user.getSignedJwtToken();

		res.status(201).json({
			success: true,
			token,
			user: {
				id: user._id,
				username: user.username,
				email: user.email,
				role: user.role,
				balance: user.balance,
			},
		});
	} catch (err) {
		res.status(400).json({
			success: false,
			message: err.message,
		});
	}
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
exports.login = async (req, res) => {
	try {
		const { email, password } = req.body;

		// Validate email & password
		if (!email || !password) {
			return res.status(400).json({
				success: false,
				message: "Please provide an email and password",
			});
		}

		// Check for user
		const user = await User.findOne({ email }).select("+password");

		if (!user) {
			return res.status(401).json({
				success: false,
				message: "Invalid credentials",
			});
		}

		// Check if password matches
		const isMatch = await user.matchPassword(password);

		if (!isMatch) {
			return res.status(401).json({
				success: false,
				message: "Invalid credentials",
			});
		}

		// Generate token
		const token = user.getSignedJwtToken();

		res.status(200).json({
			success: true,
			token,
			user: {
				id: user._id,
				username: user.username,
				email: user.email,
				role: user.role,
				balance: user.balance,
			},
		});
	} catch (err) {
		res.status(400).json({
			success: false,
			message: err.message,
		});
	}
};

// @desc    Get current logged in user
// @route   GET /api/users/me
// @access  Private
exports.getMe = async (req, res) => {
	try {
		const user = await User.findById(req.user.id);

		res.status(200).json({
			success: true,
			data: user,
		});
	} catch (err) {
		res.status(400).json({
			success: false,
			message: err.message,
		});
	}
};

// @desc    Update user balance
// @route   PUT /api/users/:id/balance
// @access  Private/Admin
exports.updateBalance = async (req, res) => {
	try {
		const { amount } = req.body;

		if (!amount) {
			return res.status(400).json({
				success: false,
				message: "Please provide an amount",
			});
		}

		const user = await User.findById(req.params.id);

		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		// Update user balance
		user.balance += parseFloat(amount);
		await user.save();

		// Create transaction record
		const Transaction = require("../models/Transaction");
		await Transaction.create({
			userId: user._id,
			amount: parseFloat(amount),
			transactionType: "deposit",
			paymentMethod: "cash",
			description: "Balance update by admin",
			processedBy: req.user.id,
		});

		res.status(200).json({
			success: true,
			data: user,
		});
	} catch (err) {
		res.status(400).json({
			success: false,
			message: err.message,
		});
	}
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
	try {
		const users = await User.find();

		res.status(200).json({
			success: true,
			count: users.length,
			data: users,
		});
	} catch (err) {
		res.status(400).json({
			success: false,
			message: err.message,
		});
	}
};
