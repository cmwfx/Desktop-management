import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

// This is a placeholder implementation - we'll connect it to your auth system later
const ProtectedRoute = ({ children, role }) => {
	const { user, isAuthenticated, loading, userRole } = useContext(AuthContext);

	// Show loading indicator while checking authentication
	if (loading) {
		return <div>Loading...</div>;
	}

	// Redirect to login if not authenticated
	if (!isAuthenticated) {
		return <Navigate to="/login" />;
	}

	// Check if user has the required role
	if (role && userRole !== role) {
		// Redirect to appropriate dashboard based on role
		return <Navigate to={userRole === "admin" ? "/admin" : "/user"} />;
	}

	// For now, we'll allow access to any authenticated user
	// In a real application, you would check user roles from your database
	// or from custom claims in Firebase

	return children;
};

export default ProtectedRoute;
