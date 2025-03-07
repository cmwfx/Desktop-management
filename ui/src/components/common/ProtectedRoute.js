import React from "react";
import { Navigate } from "react-router-dom";

// This is a placeholder implementation - we'll connect it to your auth system later
const ProtectedRoute = ({ children, role }) => {
	// For now, we'll use localStorage to check if user is logged in
	const isAuthenticated = localStorage.getItem("token");
	const userRole = localStorage.getItem("userRole");

	if (!isAuthenticated) {
		// Redirect to login if not authenticated
		return <Navigate to="/login" />;
	}

	// Check if user has the required role
	if (role && userRole !== role) {
		// Redirect to appropriate dashboard based on role
		return <Navigate to={userRole === "admin" ? "/admin" : "/user"} />;
	}

	return children;
};

export default ProtectedRoute;
