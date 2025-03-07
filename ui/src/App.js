import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// Placeholder components - we'll create these files next
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import UserDashboard from "./components/user/UserDashboard.js";
import AdminDashboard from "./components/admin/AdminDashboard";
import NotFound from "./components/common/NotFound";
import ProtectedRoute from "./components/common/ProtectedRoute";

function App() {
	return (
		<Router>
			<div className="App">
				<Routes>
					{/* Public routes */}
					<Route path="/" element={<Login />} />
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />

					{/* Protected routes */}
					<Route
						path="/user/*"
						element={
							<ProtectedRoute role="user">
								<UserDashboard />
							</ProtectedRoute>
						}
					/>

					<Route
						path="/admin/*"
						element={
							<ProtectedRoute role="admin">
								<AdminDashboard />
							</ProtectedRoute>
						}
					/>

					{/* 404 route */}
					<Route path="*" element={<NotFound />} />
				</Routes>
			</div>
		</Router>
	);
}

export default App;
