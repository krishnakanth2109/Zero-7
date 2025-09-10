import React, { useState } from "react";
import "./css/Login.css";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    alert(`Logging in with Email: ${email}`);
    // Add your API login call here
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    alert(`Password reset link sent to: ${resetEmail}`);
    setShowForgotPassword(false);
    setResetEmail("");
  };

  return (
    <div className="login-container">
      <div className="login-box">
        
        <h2 className="login-title">Admin Login</h2>
        
        {!showForgotPassword ? (
          <form onSubmit={handleLogin}>
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

            <button type="submit" className="login-btn">Login</button>

            <p className="forgot-link" onClick={() => setShowForgotPassword(true)}>
              Forgot Password?
            </p>
          </form>
        ) : (
          <form onSubmit={handleForgotPassword}>
            <div className="input-group">
              <label>Enter your email to reset password</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="login-btn">Send Reset Link</button>
            <p className="back-to-login" onClick={() => setShowForgotPassword(false)}>
              Back to Login
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
