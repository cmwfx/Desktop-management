import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const UserDashboard = () => {
	const [balance, setBalance] = useState(0);
	const [computers, setComputers] = useState([
		{ id: 1, status: "available", price: 10 },
		{ id: 2, status: "available", price: 10 },
		{ id: 3, status: "in-use", price: 10 },
		{ id: 4, status: "available", price: 10 },
	]);
	const [activeSession, setActiveSession] = useState(null);
	const navigate = useNavigate();
	const { logout, user } = useContext(AuthContext);

	const handleLogout = async () => {
		try {
			await logout();
			navigate("/login");
		} catch (error) {
			console.error("Logout error:", error);
		}
	};

	const handleDeposit = () => {
		// Placeholder for deposit functionality
		setBalance((prevBalance) => prevBalance + 20);
	};

	const handlePurchaseTime = (computerId) => {
		// Placeholder for purchasing time
		if (balance < 10) {
			alert("Insufficient balance");
			return;
		}

		setBalance((prevBalance) => prevBalance - 10);

		// Update computer status
		setComputers((prevComputers) =>
			prevComputers.map((comp) =>
				comp.id === computerId ? { ...comp, status: "in-use" } : comp
			)
		);

		// Set active session
		setActiveSession({
			computerId,
			password: "temp-" + Math.floor(1000 + Math.random() * 9000),
			timeRemaining: 60, // 60 minutes
		});
	};

	return (
		<div className="user-dashboard">
			<header>
				<h1>Internet Cafe User Dashboard</h1>
				<div className="user-info">
					<p>Welcome, {user?.email || "User"}</p>
					<button onClick={handleLogout}>Logout</button>
				</div>
			</header>

			<div className="balance-section">
				<h2>Your Balance: ${balance}</h2>
				<button onClick={handleDeposit}>Deposit $20</button>
			</div>

			{activeSession && (
				<div className="active-session">
					<h2>Your Active Session</h2>
					<p>Computer: #{activeSession.computerId}</p>
					<p>Password: {activeSession.password}</p>
					<p>Time Remaining: {activeSession.timeRemaining} minutes</p>
				</div>
			)}

			<div className="computers-section">
				<h2>Available Computers</h2>
				<div className="computers-grid">
					{computers.map((computer) => (
						<div
							key={computer.id}
							className={`computer-card ${computer.status}`}
						>
							<h3>Computer #{computer.id}</h3>
							<p>Status: {computer.status}</p>
							<p>Price: ${computer.price}/hour</p>
							{computer.status === "available" && (
								<button onClick={() => handlePurchaseTime(computer.id)}>
									Purchase Time
								</button>
							)}
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default UserDashboard;
