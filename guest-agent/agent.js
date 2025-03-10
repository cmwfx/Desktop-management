const io = require("socket.io-client");
const { exec } = require("child_process");
const os = require("os");
const fs = require("fs");
const path = require("path");

// Configuration
const CONFIG_FILE = path.join(__dirname, "config.json");
let config = {
	serverUrl: "https://your-heroku-app.herokuapp.com",
	guestId: `guest-${Math.floor(1000 + Math.random() * 9000)}`,
	computerNumber: 1,
};

// Load configuration if exists
if (fs.existsSync(CONFIG_FILE)) {
	try {
		const savedConfig = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8"));
		config = { ...config, ...savedConfig };
	} catch (err) {
		console.error("Error loading config:", err);
	}
}

// Save configuration
const saveConfig = () => {
	try {
		fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
		console.log("Configuration saved");
	} catch (err) {
		console.error("Error saving config:", err);
	}
};

// Initialize socket connection
const socket = io(config.serverUrl, {
	reconnection: true,
	reconnectionAttempts: Infinity,
	reconnectionDelay: 1000,
	reconnectionDelayMax: 5000,
	timeout: 20000,
});

// Get system information
const getSystemInfo = () => {
	return {
		hostname: os.hostname(),
		platform: os.platform(),
		release: os.release(),
		uptime: os.uptime(),
		totalMemory: os.totalmem(),
		freeMemory: os.freemem(),
		cpus: os.cpus().length,
	};
};

// Register with the server on connection
socket.on("connect", () => {
	console.log("Connected to central server");

	// Register this agent with the server
	socket.emit("register", {
		guestId: config.guestId,
		computerNumber: config.computerNumber,
		systemInfo: getSystemInfo(),
	});
});

// Handle configuration updates from server
socket.on("updateConfig", (newConfig) => {
	console.log("Received new configuration:", newConfig);

	if (
		newConfig.computerNumber &&
		newConfig.computerNumber !== config.computerNumber
	) {
		config.computerNumber = newConfig.computerNumber;
		saveConfig();

		// Re-register with new computer number
		socket.emit("register", {
			guestId: config.guestId,
			computerNumber: config.computerNumber,
			systemInfo: getSystemInfo(),
		});
	}
});

// Listen for commands from the server
socket.on("executeCommand", (data) => {
	console.log("Received command:", data);

	// Example: Command structure { action: "changePassword", newPassword: "TempPass123" }
	if (data.action === "changePassword") {
		// Windows example (PowerShell command can be adjusted as needed)
		const command = `powershell.exe -Command "net user CafeUser '${data.newPassword}'"`;
		exec(command, (error, stdout, stderr) => {
			if (error) {
				console.error("Error changing password:", stderr);
				socket.emit("commandResult", {
					guestId: config.guestId,
					computerNumber: config.computerNumber,
					success: false,
					error: stderr,
					action: data.action,
				});
				return;
			}
			console.log("Password changed successfully:", stdout);
			socket.emit("commandResult", {
				guestId: config.guestId,
				computerNumber: config.computerNumber,
				success: true,
				action: data.action,
			});
		});
	} else if (data.action === "lockComputer") {
		// Windows lock command example
		const command = `rundll32.exe user32.dll,LockWorkStation`;
		exec(command, (error, stdout, stderr) => {
			if (error) {
				console.error("Error locking computer:", stderr);
				socket.emit("commandResult", {
					guestId: config.guestId,
					computerNumber: config.computerNumber,
					success: false,
					error: stderr,
					action: data.action,
				});
				return;
			}
			console.log("Computer locked successfully");
			socket.emit("commandResult", {
				guestId: config.guestId,
				computerNumber: config.computerNumber,
				success: true,
				action: data.action,
			});
		});
	} else if (data.action === "ping") {
		// Simple ping to check if agent is alive
		socket.emit("commandResult", {
			guestId: config.guestId,
			computerNumber: config.computerNumber,
			success: true,
			action: data.action,
			timestamp: new Date().toISOString(),
		});
	}
});

// Handle disconnection
socket.on("disconnect", () => {
	console.log("Disconnected from central server");
});

// Handle connection errors
socket.on("connect_error", (error) => {
	console.error("Connection error:", error);
});

// Send heartbeat every 30 seconds
setInterval(() => {
	if (socket.connected) {
		socket.emit("heartbeat", {
			guestId: config.guestId,
			computerNumber: config.computerNumber,
			timestamp: new Date().toISOString(),
			systemInfo: getSystemInfo(),
		});
	}
}, 30000);

console.log(
	`Agent started for computer #${config.computerNumber} (${config.guestId})`
);
console.log(`Connecting to server: ${config.serverUrl}`);
