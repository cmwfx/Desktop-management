const Computer = require("../models/Computer");

// @desc    Get all computers
// @route   GET /api/computers
// @access  Public
exports.getComputers = async (req, res) => {
	try {
		const computers = await Computer.find();

		res.status(200).json({
			success: true,
			count: computers.length,
			data: computers,
		});
	} catch (err) {
		res.status(400).json({
			success: false,
			message: err.message,
		});
	}
};

// @desc    Get single computer
// @route   GET /api/computers/:id
// @access  Public
exports.getComputer = async (req, res) => {
	try {
		const computer = await Computer.findById(req.params.id);

		if (!computer) {
			return res.status(404).json({
				success: false,
				message: "Computer not found",
			});
		}

		res.status(200).json({
			success: true,
			data: computer,
		});
	} catch (err) {
		res.status(400).json({
			success: false,
			message: err.message,
		});
	}
};

// @desc    Create new computer
// @route   POST /api/computers
// @access  Private/Admin
exports.createComputer = async (req, res) => {
	try {
		const computer = await Computer.create(req.body);

		res.status(201).json({
			success: true,
			data: computer,
		});
	} catch (err) {
		res.status(400).json({
			success: false,
			message: err.message,
		});
	}
};

// @desc    Update computer
// @route   PUT /api/computers/:id
// @access  Private/Admin
exports.updateComputer = async (req, res) => {
	try {
		const computer = await Computer.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});

		if (!computer) {
			return res.status(404).json({
				success: false,
				message: "Computer not found",
			});
		}

		res.status(200).json({
			success: true,
			data: computer,
		});
	} catch (err) {
		res.status(400).json({
			success: false,
			message: err.message,
		});
	}
};

// @desc    Delete computer
// @route   DELETE /api/computers/:id
// @access  Private/Admin
exports.deleteComputer = async (req, res) => {
	try {
		const computer = await Computer.findById(req.params.id);

		if (!computer) {
			return res.status(404).json({
				success: false,
				message: "Computer not found",
			});
		}

		await computer.deleteOne();

		res.status(200).json({
			success: true,
			data: {},
		});
	} catch (err) {
		res.status(400).json({
			success: false,
			message: err.message,
		});
	}
};
