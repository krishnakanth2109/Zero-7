// File: src/Pages/Login.jsx

import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Cookie from 'js-cookie';
import api from '../../api/axios'; // Assuming this is your configured axios instance
import './css/Login.css';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // State for Password Reset Flow
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [showVerifyCodeForm, setShowVerifyCodeForm] = useState(false);
  const [showSetNewPasswordForm, setShowSetNewPasswordForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      // This correctly sends the 'identifier' to your backend
      const response = await api.post('/user/login', {
        identifier,
        password,
      });

      if (response.data && response.data.token) {
        const user = response.data.user; // Backend now sends 'user'
        
        Cookie.set('token', response.data.token, { expires: 1 });
        Cookie.set('user', JSON.stringify(user), { expires: 1 });
        
        console.log('Login successful, navigating to dashboard...');
        navigate('/admin/dashboard');
      } else {
        setError(response.data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      const response = await api.post('/user/forgot-password', { email: resetEmail });
      setSuccessMessage(response.data.message || 'Password reset link sent to your email.');
      setShowForgotPassword(false);
      setShowVerifyCodeForm(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset link. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      const response = await api.post('/user/verify-otp', { email: resetEmail, otp: resetCode });
      setSuccessMessage(response.data.message || 'Code verified successfully.');
      setResetToken(response.data.token);
      setShowVerifyCodeForm(false);
      setShowSetNewPasswordForm(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetNewPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match.');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await api.post('/user/reset-password', { email: resetEmail, password: newPassword });
      setSuccessMessage(response.data.message || 'Password updated successfully!');
      backToLogin();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to set new password.');
    } finally {
      setIsLoading(false);
    }
  };

  const backToLogin = () => {
    setShowForgotPassword(false);
    setShowVerifyCodeForm(false);
    setShowSetNewPasswordForm(false);
    setResetEmail('');
    setResetCode('');
    setNewPassword('');
    setConfirmNewPassword('');
    setResetToken('');
    setError('');
    setSuccessMessage('');
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
        {error && <p className='error-message-text'>{error}</p>}
        {successMessage && <p className='success-message-text'>{successMessage}</p>}

        {!showForgotPassword && !showVerifyCodeForm && !showSetNewPasswordForm && (
            <form className='login-form-content' onSubmit={handleLogin}>
              <h2 className='text-sm'>Zero7 Dashboard Login</h2>
              
              <div className={`input-field-group`}>
                <label htmlFor='identifier-input'>Email or Employee ID</label>
                <input
                  id='identifier-input'
                  type='text'
                  placeholder='Enter your email or ID'
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                />
              </div>

              <div className={`input-field-group password-field-group`} style={{ position: 'relative' }}>
                <label htmlFor='password-input'>Password</label>
                <input
                  id='password-input'
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Enter your password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ paddingRight: '35px' }}
                />
                <span onClick={() => setShowPassword(!showPassword)} className='password-toggle-icon'>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <button type='submit' className='submit-login-button'>
                Log In to Dashboard
              </button>

              <p className='forgot-password-link' onClick={() => setShowForgotPassword(true)}>
                Forgot Password?
              </p>
            </form>
          )}

        {showForgotPassword && !showVerifyCodeForm && !showSetNewPasswordForm && (
            <form className='reset-password-form-content' onSubmit={handleForgotPassword}>
              <h2 className='reset-password-title'>Reset Password</h2>
              <div className='input-field-group'>
                <label htmlFor='reset-email-input'>Enter your email</label>
                <input
                  id='reset-email-input'
                  type='email'
                  placeholder='Enter your email to receive a code'
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                />
              </div>
              <button type='submit' className='send-reset-link-button'>
                Send Reset Code
              </button>
              <p className='back-to-login-link' onClick={backToLogin}>
                Back to Login
              </p>
            </form>
          )}

        {showVerifyCodeForm && (
            <form className='verify-code-form-content' onSubmit={handleVerifyCode}>
              <h2 className='verify-code-title'>Verify Reset Code</h2>
              <div className='input-field-group'>
                <label htmlFor='reset-code-input'>Enter the code sent to {resetEmail}</label>
                <input
                  id='reset-code-input'
                  type='text'
                  placeholder='Enter verification code'
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  required
                />
              </div>
              <button type='submit' className='verify-code-button'>
                Verify Code
              </button>
              <p className='back-to-login-link' onClick={backToLogin}>
                Back to Login
              </p>
            </form>
          )}

        {showSetNewPasswordForm && (
            <form className='set-new-password-form-content' onSubmit={handleSetNewPassword}>
              <h2 className='set-new-password-title'>Set New Password</h2>
              <div className={`input-field-group password-field-group`} style={{ position: 'relative' }}>
                <label htmlFor='new-password-input'>New Password</label>
                <input
                  id='new-password-input'
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder='Enter new password'
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  style={{ paddingRight: '35px' }}
                />
                <span onClick={() => setShowNewPassword(!showNewPassword)} className='password-toggle-icon'>
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <div className={`input-field-group password-field-group`} style={{ position: 'relative' }}>
                <label htmlFor='confirm-new-password-input'>Confirm New Password</label>
                <input
                  id='confirm-new-password-input'
                  type={showConfirmNewPassword ? 'text' : 'password'}
                  placeholder='Confirm new password'
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                  style={{ paddingRight: '35px' }}
                />
                <span onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)} className='password-toggle-icon'>
                  {showConfirmNewPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <button type='submit' className='set-password-button'>
                Set Password
              </button>
              <p className='back-to-login-link' onClick={backToLogin}>
                Back to Login
              </p>
            </form>
          )}
      </div>
    </div>
  );
};

export default Login;