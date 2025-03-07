const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	computerId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Computer",
		required: true,
	},
	startTime: {
		type: Date,
		default: Date.now,
	},
	endTime: {
		type: Date,
		required: true,
	},
	duration: {
		type: Number, // Duration in minutes
		required: true,
	},
	cost: {
		type: Number,
		required: true,
	},
	temporaryPassword: {
		type: String,
		required: true,
	},
	sessionStatus: {
		type: String,
		enum: ["active", "expired", "terminated"],
		default: "active",
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model("Session", SessionSchema);
