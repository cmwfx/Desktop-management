const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const http = require("http");
const socketIo = require("socket.io");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
	},
});

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

// Store connected guest agents
const connectedComputers = {};

// Socket.IO connection handling
io.on("connection", (socket) => {
	console.log("New client connected:", socket.id);

	// Handle agent registration
	socket.on("register", (data) => {
		const { guestId, computerNumber, systemInfo } = data;

		// Store the socket connection with computer info
		connectedComputers[guestId] = {
			socket,
			computerNumber,
			systemInfo,
			lastSeen: new Date(),
			status: "connected",
		};

		console.log(`Guest registered: ${guestId} (Computer #${computerNumber})`);

		// Notify admins about the new computer
		io.to("admins").emit("computerStatusUpdate", {
			guestId,
			computerNumber,
			status: "connected",
			systemInfo,
		});
	});

	// Handle command results
	socket.on("commandResult", (result) => {
		console.log("Command result received:", result);

		// Update computer status based on command result
		if (connectedComputers[result.guestId]) {
			connectedComputers[result.guestId].lastCommandResult = result;

			// Notify admins about the command result
			io.to("admins").emit("commandResult", result);
		}
	});

	// Handle heartbeats
	socket.on("heartbeat", (data) => {
		const { guestId, computerNumber, timestamp, systemInfo } = data;

		if (connectedComputers[guestId]) {
			connectedComputers[guestId].lastSeen = new Date();
			connectedComputers[guestId].systemInfo = systemInfo;

			// Optionally notify admins about the heartbeat
			// io.to('admins').emit('computerHeartbeat', data);
		}
	});

	// Handle admin connections
	socket.on("adminLogin", (data) => {
		// Add the socket to the admins room
		socket.join("admins");
		console.log("Admin connected:", socket.id);

		// Send the current state of all computers
		socket.emit(
			"computersList",
			Object.keys(connectedComputers).map((guestId) => ({
				guestId,
				computerNumber: connectedComputers[guestId].computerNumber,
				status: connectedComputers[guestId].status,
				lastSeen: connectedComputers[guestId].lastSeen,
				systemInfo: connectedComputers[guestId].systemInfo,
			}))
		);
	});

	// Handle disconnection
	socket.on("disconnect", () => {
		// Find and remove the disconnected guest
		for (const [guestId, computer] of Object.entries(connectedComputers)) {
			if (computer.socket.id === socket.id) {
				computer.status = "disconnected";
				computer.lastSeen = new Date();

				// Keep the entry but mark as disconnected
				// We don't delete it so admins can still see it in the list

				console.log(
					`Guest ${guestId} (Computer #${computer.computerNumber}) disconnected`
				);

				// Notify admins about the disconnection
				io.to("admins").emit("computerStatusUpdate", {
					guestId,
					computerNumber: computer.computerNumber,
					status: "disconnected",
				});

				break;
			}
		}
	});
});

// Define routes
app.use("/api/users", require("./routes/users"));
app.use("/api/computers", require("./routes/computers"));
app.use("/api/sessions", require("./routes/sessions"));
app.use("/api/transactions", require("./routes/transactions"));

// API endpoint to send a command to a guest computer
app.post("/api/remote-command", async (req, res) => {
	try {
		const { computerNumber, command } = req.body;

		// Find the guest by computer number
		const guestEntry = Object.entries(connectedComputers).find(
			([_, computer]) =>
				computer.computerNumber === computerNumber &&
				computer.status === "connected"
		);

		if (!guestEntry) {
			return res.status(404).json({
				success: false,
				message: `Computer #${computerNumber} not found or not connected`,
			});
		}

		const [guestId, computer] = guestEntry;

		// Send the command to the guest
		computer.socket.emit("executeCommand", command);

		res.status(200).json({
			success: true,
			message: `Command sent to Computer #${computerNumber}`,
			guestId,
		});
	} catch (err) {
		console.error("Error sending command:", err);
		res.status(500).json({
			success: false,
			message: "Error sending command",
			error: err.message,
		});
	}
});

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
	// Set static folder
	app.use(express.static(path.join(__dirname, "../ui/build")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "../ui", "build", "index.html"));
	});
} else {
	// Default route for development
	app.get("/", (req, res) => {
		res.send("Internet Cafe Management API is running");
	});
}

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
