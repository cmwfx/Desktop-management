import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [error, setError] = useState("");
	const navigate = useNavigate();
	const { login, isAuthenticated, userRole } = useContext(AuthContext);

	// Redirect if already authenticated
	useEffect(() => {
		if (isAuthenticated) {
			navigate(userRole === "admin" ? "/admin" : "/user");
		}
	}, [isAuthenticated, userRole, navigate]);

	const onChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		setError("");

		try {
			// Use backend API for authentication
			await login(formData);

			// Redirection will happen in the useEffect hook
		} catch (err) {
			setError(err.message || "Invalid credentials");
			console.error("Login error:", err);
		}
	};

	return (
		<div className="login-container">
			<h1>Internet Cafe Management</h1>
			<h2>Login</h2>
			{error && <p className="error">{error}</p>}
			<form onSubmit={onSubmit}>
				<div className="form-group">
					<label htmlFor="email">Email</label>
					<input
						type="email"
						name="email"
						value={formData.email}
						onChange={onChange}
						required
					/>
				</div>
				<div className="form-group">
					<label htmlFor="password">Password</label>
					<input
						type="password"
						name="password"
						value={formData.password}
						onChange={onChange}
						required
					/>
				</div>
				<button type="submit">Login</button>
			</form>
			<p>
				Don't have an account? <Link to="/register">Register</Link>
			</p>
			<div className="login-help">
				<p>
					<strong>Hint:</strong> For admin access, use an email containing
					"admin"
				</p>
			</div>
		</div>
	);
};

export default Login;
