import React, { createContext, useState, useEffect } from "react";
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../firebase";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [loading, setLoading] = useState(true);
	const [userRole, setUserRole] = useState(null);

	// Helper function to determine if a user is an admin based on email
	const checkIfAdmin = (email) => {
		// For development, we'll consider emails containing 'admin' as admin users
		return email && (email.includes("admin") || email.includes("Admin"));
	};

	useEffect(() => {
		// Listen for auth state changes
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			if (currentUser) {
				// User is signed in
				setUser(currentUser);
				setIsAuthenticated(true);

				// Set user role based on email
				const role = checkIfAdmin(currentUser.email) ? "admin" : "user";
				setUserRole(role);
			} else {
				// User is signed out
				setUser(null);
				setIsAuthenticated(false);
				setUserRole(null);
			}
			setLoading(false);
		});

		// Cleanup subscription on unmount
		return () => unsubscribe();
	}, []);

	// Register a new user
	const register = async (email, password) => {
		try {
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			return userCredential.user;
		} catch (error) {
			throw error;
		}
	};

	// Login a user
	const login = async (email, password) => {
		try {
			const userCredential = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);
			return userCredential.user;
		} catch (error) {
			throw error;
		}
	};

	// Logout a user
	const logout = async () => {
		try {
			await signOut(auth);
		} catch (error) {
			throw error;
		}
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				isAuthenticated,
				loading,
				userRole,
				register,
				login,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
