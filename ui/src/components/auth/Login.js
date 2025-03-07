import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const { email, password } = formData;

	const onChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const onSubmit = async (e) => {
		e.preventDefault();

		// This is a placeholder - we'll implement actual login logic later
		try {
			// Simulate successful login
			localStorage.setItem("token", "dummy-token");

			// For demo purposes, let's set a role based on email
			const role = email.includes("admin") ? "admin" : "user";
			localStorage.setItem("userRole", role);

			// Redirect to appropriate dashboard
			navigate(role === "admin" ? "/admin" : "/user");
		} catch (err) {
			setError("Invalid credentials");
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
						value={email}
						onChange={onChange}
						required
					/>
				</div>
				<div className="form-group">
					<label htmlFor="password">Password</label>
					<input
						type="password"
						name="password"
						value={password}
						onChange={onChange}
						required
					/>
				</div>
				<button type="submit">Login</button>
			</form>
			<p>
				Don't have an account? <Link to="/register">Register</Link>
			</p>
		</div>
	);
};

export default Login;
