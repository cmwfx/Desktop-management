const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	amount: {
		type: Number,
		required: [true, "Please provide an amount"],
	},
	transactionType: {
		type: String,
		enum: ["deposit", "purchase"],
		required: true,
	},
	paymentMethod: {
		type: String,
		enum: ["cash", "online", "system"],
		default: "cash",
	},
	description: {
		type: String,
		default: "",
	},
	sessionId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Session",
		default: null,
	},
	processedBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		default: null,
	},
	transactionDate: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model("Transaction", TransactionSchema);
