import React, { useState, useEffect, useContext } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "../../context/AuthContext";

const ComputerMonitor = () => {
	const [computers, setComputers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [socket, setSocket] = useState(null);
	const { user } = useContext(AuthContext);

	useEffect(() => {
		// Create socket connection
		const socketUrl =
			process.env.NODE_ENV === "production"
				? window.location.origin
				: "http://localhost:5000";

		const newSocket = io(socketUrl);
		setSocket(newSocket);

		// Connect to socket
		newSocket.on("connect", () => {
			console.log("Connected to server");

			// Register as admin
			newSocket.emit("adminLogin", { userId: user?.id });
		});

		// Listen for computers list
		newSocket.on("computersList", (data) => {
			console.log("Received computers list:", data);
			setComputers(data);
			setLoading(false);
		});

		// Listen for computer status updates
		newSocket.on("computerStatusUpdate", (data) => {
			console.log("Computer status update:", data);
			setComputers((prevComputers) => {
				// Check if computer already exists in the list
				const existingIndex = prevComputers.findIndex(
					(comp) => comp.guestId === data.guestId
				);

				if (existingIndex >= 0) {
					// Update existing computer
					const updatedComputers = [...prevComputers];
					updatedComputers[existingIndex] = {
						...updatedComputers[existingIndex],
						...data,
					};
					return updatedComputers;
				} else {
					// Add new computer
					return [...prevComputers, data];
				}
			});
		});

		// Listen for command results
		newSocket.on("commandResult", (result) => {
			console.log("Command result:", result);
			// You could show a notification or update the UI based on the result
		});

		// Handle errors
		newSocket.on("connect_error", (err) => {
			console.error("Connection error:", err);
			setError("Failed to connect to server");
			setLoading(false);
		});

		// Cleanup on unmount
		return () => {
			newSocket.disconnect();
		};
	}, [user]);

	const handleSendCommand = (computerNumber, action) => {
		if (!socket) return;

		let command = { action };

		if (action === "changePassword") {
			const newPassword = prompt("Enter new password:");
			if (!newPassword) return;
			command.newPassword = newPassword;
		}

		// Send command to server
		fetch("/api/remote-command", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
			body: JSON.stringify({
				computerNumber,
				command,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.success) {
					console.log("Command sent successfully");
				} else {
					console.error("Failed to send command:", data.message);
					alert(`Failed to send command: ${data.message}`);
				}
			})
			.catch((err) => {
				console.error("Error sending command:", err);
				alert("Error sending command");
			});
	};

	if (loading) {
		return <div className="loading">Loading computers...</div>;
	}

	if (error) {
		return <div className="error-message">{error}</div>;
	}

	return (
		<div className="computer-monitor">
			<h2>Computer Monitor</h2>

			{computers.length === 0 ? (
				<p>No computers connected</p>
			) : (
				<div className="computers-grid">
					{computers.map((computer) => (
						<div
							key={computer.guestId}
							className={`computer-card ${computer.status}`}
						>
							<h3>Computer #{computer.computerNumber}</h3>
							<p>Status: {computer.status}</p>
							<p>Last Seen: {new Date(computer.lastSeen).toLocaleString()}</p>

							{computer.systemInfo && (
								<div className="system-info">
									<p>
										OS: {computer.systemInfo.platform}{" "}
										{computer.systemInfo.release}
									</p>
									<p>Hostname: {computer.systemInfo.hostname}</p>
									<p>
										Memory:{" "}
										{Math.round(computer.systemInfo.freeMemory / 1024 / 1024)}{" "}
										MB free /{" "}
										{Math.round(computer.systemInfo.totalMemory / 1024 / 1024)}{" "}
										MB total
									</p>
								</div>
							)}

							{computer.status === "connected" && (
								<div className="computer-actions">
									<button
										onClick={() =>
											handleSendCommand(computer.computerNumber, "ping")
										}
									>
										Ping
									</button>
									<button
										onClick={() =>
											handleSendCommand(computer.computerNumber, "lockComputer")
										}
									>
										Lock
									</button>
									<button
										onClick={() =>
											handleSendCommand(
												computer.computerNumber,
												"changePassword"
											)
										}
									>
										Change Password
									</button>
								</div>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default ComputerMonitor;
