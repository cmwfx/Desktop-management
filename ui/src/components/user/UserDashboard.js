import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { getAllComputers } from "../../services/computers";
import { createSession, getMySession } from "../../services/sessions";
import { getMyTransactions } from "../../services/transactions";

const UserDashboard = () => {
	const [computers, setComputers] = useState([]);
	const [activeSession, setActiveSession] = useState(null);
	const [transactions, setTransactions] = useState([]);
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

				// Fetch active session
				const sessionData = await getMySession();
				if (sessionData.success && sessionData.data) {
					setActiveSession(sessionData.data);
				}

				// Fetch transactions
				const transactionsData = await getMyTransactions();
				if (transactionsData.success) {
					setTransactions(transactionsData.data);
				}

				setLoading(false);
			} catch (err) {
				setError("Failed to load data. Please try again.");
				setLoading(false);
				console.error("Error fetching data:", err);
			}
		};

		fetchData();
	}, []);

	const handleLogout = async () => {
		try {
			await logout();
			navigate("/login");
		} catch (error) {
			console.error("Logout error:", error);
		}
	};

	const handlePurchaseTime = async (computerId) => {
		try {
			// Check if user has an active session
			if (activeSession) {
				setError(
					"You already have an active session. Please end it before purchasing a new one."
				);
				return;
			}

			// Purchase time (60 minutes)
			const sessionData = {
				computerId,
				duration: 60, // 60 minutes
			};

			const response = await createSession(sessionData);

			if (response.success) {
				setActiveSession(response.data.session);

				// Update computers list
				const updatedComputers = computers.map((comp) =>
					comp._id === computerId ? { ...comp, status: "in-use" } : comp
				);
				setComputers(updatedComputers);

				// Show success message
				alert(
					`Computer #${response.data.computer.computerNumber} assigned. Your temporary password is: ${response.data.computer.temporaryPassword}`
				);
			}
		} catch (err) {
			setError(err.message || "Failed to purchase time. Please try again.");
			console.error("Purchase error:", err);
		}
	};

	if (loading) {
		return <div className="loading">Loading...</div>;
	}

	return (
		<div className="user-dashboard">
			<header>
				<h1>Internet Cafe User Dashboard</h1>
				<div className="user-info">
					<p>Welcome, {user?.username || user?.email || "User"}</p>
					<p>Balance: ${user?.balance || 0}</p>
					<button onClick={handleLogout}>Logout</button>
				</div>
			</header>

			{error && <div className="error-message">{error}</div>}

			{activeSession && (
				<div className="active-session">
					<h2>Your Active Session</h2>
					<p>Computer: #{activeSession.computerId?.computerNumber || "N/A"}</p>
					<p>Password: {activeSession.temporaryPassword}</p>
					<p>
						Time Remaining:{" "}
						{activeSession.endTime
							? Math.max(
									0,
									Math.floor(
										(new Date(activeSession.endTime) - new Date()) / 60000
									)
							  )
							: "N/A"}{" "}
						minutes
					</p>
				</div>
			)}

			<div className="computers-section">
				<h2>Available Computers</h2>
				<div className="computers-grid">
					{computers.map((computer) => (
						<div
							key={computer._id}
							className={`computer-card ${computer.status}`}
						>
							<h3>Computer #{computer.computerNumber}</h3>
							<p>Status: {computer.status}</p>
							<p>Price: ${computer.pricePerHour}/hour</p>
							{computer.status === "available" && (
								<button
									onClick={() => handlePurchaseTime(computer._id)}
									disabled={user?.balance < (computer.pricePerHour / 60) * 60}
								>
									Purchase Time
								</button>
							)}
							{user?.balance < (computer.pricePerHour / 60) * 60 &&
								computer.status === "available" && (
									<p className="insufficient-balance">Insufficient balance</p>
								)}
						</div>
					))}
				</div>
			</div>

			<div className="transactions-section">
				<h2>Recent Transactions</h2>
				{transactions.length === 0 ? (
					<p>No transactions found.</p>
				) : (
					<table className="transactions-table">
						<thead>
							<tr>
								<th>Date</th>
								<th>Type</th>
								<th>Amount</th>
								<th>Description</th>
							</tr>
						</thead>
						<tbody>
							{transactions.slice(0, 5).map((transaction) => (
								<tr key={transaction._id}>
									<td>
										{new Date(transaction.transactionDate).toLocaleDateString()}
									</td>
									<td>{transaction.transactionType}</td>
									<td
										className={transaction.amount > 0 ? "positive" : "negative"}
									>
										${Math.abs(transaction.amount)}
									</td>
									<td>{transaction.description}</td>
								</tr>
							))}
						</tbody>
					</table>
				)}
			</div>
		</div>
	);
};

export default UserDashboard;
