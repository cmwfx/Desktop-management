import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
	const [computers, setComputers] = useState([
		{ id: 1, status: "available", user: null, timeRemaining: 0 },
		{ id: 2, status: "available", user: null, timeRemaining: 0 },
		{ id: 3, status: "in-use", user: "user1", timeRemaining: 45 },
		{ id: 4, status: "in-use", user: "user2", timeRemaining: 30 },
	]);

	const [users, setUsers] = useState([
		{ id: 1, username: "user1", balance: 25 },
		{ id: 2, username: "user2", balance: 15 },
		{ id: 3, username: "user3", balance: 0 },
	]);

	const navigate = useNavigate();

	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("userRole");
		navigate("/login");
	};

	const handleAddBalance = (userId, amount) => {
		// Placeholder for adding balance to user account
		setUsers((prevUsers) =>
			prevUsers.map((user) =>
				user.id === userId ? { ...user, balance: user.balance + amount } : user
			)
		);
	};

	return (
		<div className="admin-dashboard">
			<header>
				<h1>Internet Cafe Admin Dashboard</h1>
				<button onClick={handleLogout}>Logout</button>
			</header>

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
						{computers.map((computer) => (
							<tr key={computer.id}>
								<td>{computer.id}</td>
								<td>{computer.status}</td>
								<td>{computer.user || "N/A"}</td>
								<td>
									{computer.timeRemaining > 0
										? `${computer.timeRemaining} min`
										: "N/A"}
								</td>
								<td>
									{computer.status === "in-use" && (
										<button>Force End Session</button>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<div className="users-section">
				<h2>User Management</h2>
				<table className="users-table">
					<thead>
						<tr>
							<th>Username</th>
							<th>Balance</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{users.map((user) => (
							<tr key={user.id}>
								<td>{user.username}</td>
								<td>${user.balance}</td>
								<td>
									<button onClick={() => handleAddBalance(user.id, 10)}>
										Add $10
									</button>
									<button onClick={() => handleAddBalance(user.id, 20)}>
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
