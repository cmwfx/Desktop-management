import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { getAllComputers } from "../../services/computers";
import { getAllSessions, endSession } from "../../services/sessions";
import { getAllUsers } from "../../services/auth";
import { createDeposit } from "../../services/transactions";

const AdminDashboard = () => {
	const [computers, setComputers] = useState([]);
	const [users, setUsers] = useState([]);
	const [sessions, setSessions] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	const navigate = useNavigate();
	const { logout, user } = useContext(AuthContext);

	// Fetch data on component mount
	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);

				// Fetch computers
				const computersData = await getAllComputers();
				if (computersData.success) {
					setComputers(computersData.data);
				}

				// Fetch users
				const usersData = await getAllUsers();
				if (usersData.success) {
					setUsers(usersData.data);
				}

				// Fetch sessions
				const sessionsData = await getAllSessions();
				if (sessionsData.success) {
					setSessions(sessionsData.data);
				}

				setLoading(false);
			} catch (err) {
				setError("Failed to load data. Please try again.");
				setLoading(false);
				console.error("Error fetching data:", err);
			}
		};

		fetchData();

		// Set up interval to refresh data every 30 seconds
		const interval = setInterval(() => {
			fetchData();
		}, 30000);

		// Clean up interval on component unmount
		return () => clearInterval(interval);
	}, []);

	const handleLogout = async () => {
		try {
			await logout();
			navigate("/login");
		} catch (error) {
			console.error("Logout error:", error);
		}
	};

	const handleAddBalance = async (userId, amount) => {
		try {
			const depositData = {
				userId,
				amount,
				paymentMethod: "cash",
				description: "Admin deposit",
			};

			const response = await createDeposit(depositData);

			if (response.success) {
				// Update users list
				const updatedUsers = users.map((user) =>
					user._id === userId
						? { ...user, balance: user.balance + amount }
						: user
				);
				setUsers(updatedUsers);

				// Show success message
				alert(`Successfully added $${amount} to user's balance.`);
			}
		} catch (err) {
			setError(err.message || "Failed to add balance. Please try again.");
			console.error("Deposit error:", err);
		}
	};

	const handleEndSession = async (sessionId) => {
		try {
			const response = await endSession(sessionId);

			if (response.success) {
				// Update sessions list
				const updatedSessions = sessions.map((session) =>
					session._id === sessionId
						? { ...session, sessionStatus: "terminated" }
						: session
				);
				setSessions(updatedSessions);

				// Update computers list
				const session = sessions.find((s) => s._id === sessionId);
				if (session) {
					const updatedComputers = computers.map((computer) =>
						computer._id === session.computerId._id
							? { ...computer, status: "available", assignedUser: null }
							: computer
					);
					setComputers(updatedComputers);
				}

				// Show success message
				alert("Session ended successfully.");
			}
		} catch (err) {
			setError(err.message || "Failed to end session. Please try again.");
			console.error("End session error:", err);
		}
	};

	if (loading) {
		return <div className="loading">Loading...</div>;
	}

	// Get active sessions
	const activeSessions = sessions.filter(
		(session) => session.sessionStatus === "active"
	);

	return (
		<div className="admin-dashboard">
			<header>
				<h1>Internet Cafe Admin Dashboard</h1>
				<div className="user-info">
					<p>Welcome, Admin {user?.username || user?.email}</p>
					<button onClick={handleLogout}>Logout</button>
				</div>
			</header>

			{error && <div className="error-message">{error}</div>}

			<div className="dashboard-stats">
				<div className="stat-card">
					<h3>Total Computers</h3>
					<p>{computers.length}</p>
				</div>
				<div className="stat-card">
					<h3>Computers In Use</h3>
					<p>{computers.filter((comp) => comp.status === "in-use").length}</p>
				</div>
				<div className="stat-card">
					<h3>Total Users</h3>
					<p>{users.length}</p>
				</div>
				<div className="stat-card">
					<h3>Active Sessions</h3>
					<p>{activeSessions.length}</p>
				</div>
			</div>

			<div className="computers-section">
				<h2>Computer Status</h2>
				<table className="computers-table">
					<thead>
						<tr>
							<th>Computer #</th>
							<th>Status</th>
							<th>User</th>
							<th>Time Remaining</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{computers.map((computer) => {
							// Find active session for this computer
							const session = activeSessions.find(
								(s) => s.computerId && s.computerId._id === computer._id
							);

							// Calculate time remaining
							const timeRemaining =
								session && session.endTime
									? Math.max(
											0,
											Math.floor(
												(new Date(session.endTime) - new Date()) / 60000
											)
									  )
									: 0;

							// Find user for this computer
							const computerUser =
								session && session.userId
									? users.find((u) => u._id === session.userId._id)
									: null;

							return (
								<tr key={computer._id}>
									<td>{computer.computerNumber}</td>
									<td>{computer.status}</td>
									<td>{computerUser ? computerUser.username : "N/A"}</td>
									<td>
										{computer.status === "in-use"
											? `${timeRemaining} min`
											: "N/A"}
									</td>
									<td>
										{computer.status === "in-use" && session && (
											<button onClick={() => handleEndSession(session._id)}>
												Force End Session
											</button>
										)}
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>

			<div className="users-section">
				<h2>User Management</h2>
				<table className="users-table">
					<thead>
						<tr>
							<th>Username</th>
							<th>Email</th>
							<th>Balance</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{users.map((user) => (
							<tr key={user._id}>
								<td>{user.username}</td>
								<td>{user.email}</td>
								<td>${user.balance}</td>
								<td>
									<button onClick={() => handleAddBalance(user._id, 10)}>
										Add $10
									</button>
									<button onClick={() => handleAddBalance(user._id, 20)}>
										Add $20
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default AdminDashboard;
