import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import Cookie from 'js-cookie';
import './css/Login.css'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null); // 'superAdmin', 'admin', 'recruiter'
  const [isLoading, setIsLoading] = useState(false); // For loading animation
  const navigate = useNavigate();

  // Function to determine if inputs should be blurred
  const areInputsBlurred = selectedRole === null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true); // Start loading animation

    const payload = { email, password, role: selectedRole }; // Include selected role
    const url = process.env.REACT_APP_API_URL
      ? `${process.env.REACT_APP_API_URL}/auth`
      : 'http://localhost:5000/api/auth';

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();

      if (response.ok && data.Token) {
        Cookie.set('token', data.Token, { expires: 1 });
        localStorage.setItem('isAdmin', 'true'); // This might need to be dynamic based on role
        console.log('Login successful, navigating to dashboard...');
        navigate('/admin/dashboard');
      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false); // Stop loading animation
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    alert(`Password reset link sent to: ${resetEmail}`);
    setShowForgotPassword(false);
    setResetEmail('');
  };

  // Dynamic styling for login button
  const getLoginButtonStyle = (role) => {
    switch (role) {
      case 'superAdmin':
        return { backgroundColor: '#FF6347', color: 'white' }; // Tomato
      case 'admin':
        return { backgroundColor: '#4CAF50', color: 'white' }; // Green
      case 'recruiter':
        return { backgroundColor: '#FFD700', color: 'black' }; // Gold
      default:
        return {}; // Default style
    }
  };

  return (
    <div className='login-page-container'>
      {isLoading && (
        <div className='loading-animation-overlay'>
          <div className='spinner-loader'></div>
        </div>
      )}

      <div className='login-graphic-section'>
        <img
          src='https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop'
          alt='Login Illustration'
          className='login-illustration-image'
        />
      </div>

      <div className='login-form-section'>
        {!showForgotPassword ? (
          <form className='login-form-content' onSubmit={handleLogin}>
            <h2 className='login-form-title'>
              Zero 7 Technologies <br />
              Admin Dashboard Login
            </h2>

            <div className='role-selection-group'>
              <button
                type='button'
                className={`role-select-button ${selectedRole === 'superAdmin' ? 'selected-role-super-admin' : ''}`}
                onClick={() => setSelectedRole('superAdmin')}
              >
                Super Admin
              </button>
              <button
                type='button'
                className={`role-select-button ${selectedRole === 'admin' ? 'selected-role-admin' : ''}`}
                onClick={() => setSelectedRole('admin')}
              >
                Admin
              </button>
              <button
                type='button'
                className={`role-select-button ${selectedRole === 'recruiter' ? 'selected-role-recruiter' : ''}`}
                onClick={() => setSelectedRole('recruiter')}
              >
                Recruiter
              </button>
            </div>

            <div className={`input-field-group ${areInputsBlurred ? 'blurred-input-state' : ''}`}>
              <label htmlFor='email-input'>Email Address</label>
              <input
                id='email-input'
                type='email'
                placeholder='Enter your email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={areInputsBlurred}
              />
            </div>

            <div className={`input-field-group password-field-group ${areInputsBlurred ? 'blurred-input-state' : ''}`} style={{ position: "relative" }}>
              <label htmlFor='password-input'>Password</label>
              <input
                id='password-input'
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingRight: "35px" }}
                disabled={areInputsBlurred}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className='password-toggle-icon'
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {error && <p className='error-message-text'>{error}</p>}

            <button
              type='submit'
              className='submit-login-button'
              style={getLoginButtonStyle(selectedRole)}
              disabled={areInputsBlurred}
            >
              Sign In to Dashboard
            </button>

            <p
              className='forgot-password-link'
              onClick={() => setShowForgotPassword(true)}
            >
              Forgot Password?
            </p>
          </form>
        ) : (
          <form className='reset-password-form-content' onSubmit={handleForgotPassword}>
            <h2 className='reset-password-title'>Reset Password</h2>

            <div className='input-field-group'>
              <label htmlFor='reset-email-input'>Enter your email</label>
              <input
                id='reset-email-input'
                type='email'
                placeholder='Enter your email'
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
              />
            </div>

            <button type='submit' className='send-reset-link-button'>
              Send Reset Link
            </button>

            <p
              className='back-to-login-link'
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