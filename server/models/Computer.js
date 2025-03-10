const mongoose = require("mongoose");

const ComputerSchema = new mongoose.Schema({
	computerNumber: {
		type: Number,
		required: [true, "Please provide a computer number"],
		unique: true,
	},
	currentPassword: {
		type: String,
		default: null,
	},
	status: {
		type: String,
		enum: ["available", "in-use", "locked", "maintenance"],
		default: "available",
	},
	assignedUser: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		default: null,
	},
	expiryTimestamp: {
		type: Date,
		default: null,
	},
	pricePerHour: {
		type: Number,
		required: [true, "Please provide a price per hour"],
		default: 10,
	},
	meshCentralId: {
		type: String,
		default: null,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model("Computer", ComputerSchema);
