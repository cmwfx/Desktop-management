import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Register = () => {
	const [formData, setFormData] = useState({
		username: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [error, setError] = useState("");
	const navigate = useNavigate();
	const { register, isAuthenticated, userRole } = useContext(AuthContext);

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

		if (formData.password !== formData.confirmPassword) {
			setError("Passwords do not match");
			return;
		}

		try {
			// Use backend API for registration
			const userData = {
				username: formData.username,
				email: formData.email,
				password: formData.password,
			};

			await register(userData);

			// Redirect to login page after successful registration
			navigate("/login");
		} catch (err) {
			setError(err.message || "Registration failed");
			console.error("Registration error:", err);
		}
	};

	return (
		<div className="register-container">
			<h1>Internet Cafe Management</h1>
			<h2>Register</h2>
			{error && <p className="error">{error}</p>}
			<form onSubmit={onSubmit}>
				<div className="form-group">
					<label htmlFor="username">Username</label>
					<input
						type="text"
						name="username"
						value={formData.username}
						onChange={onChange}
						required
					/>
				</div>
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
				<div className="form-group">
					<label htmlFor="confirmPassword">Confirm Password</label>
					<input
						type="password"
						name="confirmPassword"
						value={formData.confirmPassword}
						onChange={onChange}
						required
					/>
				</div>
				<button type="submit">Register</button>
			</form>
			<p>
				Already have an account? <Link to="/login">Login</Link>
			</p>
			<div className="register-help">
				<p>
					<strong>Hint:</strong> For admin access, use an email containing
					"admin"
				</p>
			</div>
		</div>
	);
};

export default Register;
