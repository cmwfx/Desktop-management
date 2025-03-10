const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
	.connect(process.env.MONGODB_URI)
	.then(() => {
		console.log("Connected to MongoDB");
	})
	.catch((err) => {
		console.error("MongoDB connection error:", err);
	});

// Define routes
app.use("/api/users", require("./routes/users"));
app.use("/api/computers", require("./routes/computers"));
app.use("/api/sessions", require("./routes/sessions"));
app.use("/api/transactions", require("./routes/transactions"));

// Default route
app.get("/", (req, res) => {
	res.send("Internet Cafe Management API is running");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

