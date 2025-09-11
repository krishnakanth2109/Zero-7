import React, { useState } from "react";
import "./css/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [error, setError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    if (email === "admin@gmail.com" && password === "admin123") {
      localStorage.setItem("isAdmin", "true");
      window.location.href = "/admin/dashboard";
    } else {
      setError("Invalid email or password");
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    alert(`Password reset link sent to: ${resetEmail}`);
    setShowForgotPassword(false);
    setResetEmail("");
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <img
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"
          alt="Login Illustration"
        />
      </div>

      <div className="login-right">
        {!showForgotPassword ? (
          <form className="login-form" onSubmit={handleLogin}>
            <h2 className="login-title">Zero 7 Technologies <br/>Admin Login</h2>

            <div className="input-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="error-text">{error}</p>}

            <button type="submit" className="login-btn">
              Login
            </button>

            <p
              className="forgot-link"
              onClick={() => setShowForgotPassword(true)}
            >
              Forgot Password?
            </p>
          </form>
        ) : (
          <form className="login-form" onSubmit={handleForgotPassword}>
            <h2 className="login-title">Reset Password</h2>

            <div className="input-group">
              <label>Enter your email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="login-btn">
              Send Reset Link
            </button>

            <p
              className="back-to-login"
              onClick={() => setShowForgotPassword(false)}
            >
              Back to Login
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
