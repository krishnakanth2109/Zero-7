import React, { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import Cookie from 'js-cookie'
import api from '../../api/axios' // Assuming this is your configured axios instance
import './css/Login.css'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false) // For loading animation
  const navigate = useNavigate()

  // State for Password Reset Flow
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetCode, setResetCode] = useState('') // For verifying the reset code
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [resetToken, setResetToken] = useState('') // Token received after code verification

  // View management for password reset flow
  const [showVerifyCodeForm, setShowVerifyCodeForm] = useState(false)
  const [showSetNewPasswordForm, setShowSetNewPasswordForm] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false)

  // Function to get the base API URL
  const getApiUrl = (endpoint) => {
    return process.env.REACT_APP_API_URL
      ? `${process.env.REACT_APP_API_URL}${endpoint}`
      : `http://localhost:5000/api${endpoint}`
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMessage('')
    setIsLoading(true)

    const payload = { email, password }
    const url = getApiUrl('/user/login')

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    }

    try {
      const response = await fetch(url, options)
      const data = await response.json()

      if (response.ok && data.token) {
        Cookie.set('token', data.token, { expires: 1 })
        Cookie.set('user', JSON.stringify(data.payload), { expires: 1 })
        console.log('Login successful, navigating to dashboard...')
        navigate('/admin/dashboard')
      } else {
        setError(data.message || 'Login failed. Please check your credentials.')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMessage('')
    setIsLoading(true)

    try {
      const response = await api.post('/user/forgot-password', {
        email: resetEmail,
      })
      console.log(response.data)
      setSuccessMessage(
        response.data.message || 'Password reset link sent to your email.',
      )
      setShowForgotPassword(false) // Hide forgot password form
      setShowVerifyCodeForm(true) // Show verify code form
    } catch (err) {
      console.error('Forgot password error:', err)
      setError(
        err.response?.data?.message || 'Failed to send reset link. Try again.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyCode = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMessage('')
    setIsLoading(true)

    try {
      const response = await api.post('/user/verify-otp', {
        email: resetEmail,
        otp: resetCode,
      })
      console.log(response.data)
      setSuccessMessage(response.data.message || 'Code verified successfully.')
      setResetToken(response.data.token) // Store the token for setting new password
      setShowVerifyCodeForm(false) // Hide verify code form
      setShowSetNewPasswordForm(true) // Show set new password form
    } catch (err) {
      console.error('Verify code error:', err)
      setError(err.response?.data?.message || 'Invalid code. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSetNewPassword = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMessage('')
    setIsLoading(true)

    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match.')
      setIsLoading(false)
      return
    }

    try {
      // Assuming your API endpoint uses the reset token for authorization
      const response = await api.post(
        '/user/reset-password',
        {
          email: resetEmail,
          password: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${resetToken}`, // Pass the reset token
          },
        },
      )
      console.log(response.data)
      setSuccessMessage(
        response.data.message || 'Password updated successfully!',
      )
      // Reset all password reset related states and go back to login form
      setShowSetNewPasswordForm(false)
      setShowForgotPassword(false)
      setShowVerifyCodeForm(false)
      setResetEmail('')
      setResetCode('')
      setNewPassword('')
      setConfirmNewPassword('')
      setResetToken('')
    } catch (err) {
      console.error('Set new password error:', err)
      setError(err.response?.data?.message || 'Failed to set new password.')
    } finally {
      setIsLoading(false)
    }
  }

  // Function to reset password flow states and go back to login
  const backToLogin = () => {
    setShowForgotPassword(false)
    setShowVerifyCodeForm(false)
    setShowSetNewPasswordForm(false)
    setResetEmail('')
    setResetCode('')
    setNewPassword('')
    setConfirmNewPassword('')
    setResetToken('')
    setError('')
    setSuccessMessage('')
  }

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
        {/* Display Error and Success Messages */}
        {error && <p className='error-message-text'>{error}</p>}
        {successMessage && (
          <p className='success-message-text'>{successMessage}</p>
        )}

        {/* Conditional Rendering of Forms */}

        {/* 1. Login Form */}
        {!showForgotPassword &&
          !showVerifyCodeForm &&
          !showSetNewPasswordForm && (
            <form className='login-form-content' onSubmit={handleLogin}>
              <h2 className='text-sm'>Zero7 Dashboard Login</h2>
              <div className={`input-field-group`}>
                <label htmlFor='email-input'>Email Address</label>
                <input
                  id='email-input'
                  type='email'
                  placeholder='Enter your email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div
                className={`input-field-group password-field-group`}
                style={{ position: 'relative' }}>
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
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className='password-toggle-icon'>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <button type='submit' className='submit-login-button'>
                Log In to Dashboard
              </button>

              <p
                className='forgot-password-link'
                onClick={() => setShowForgotPassword(true)}>
                Forgot Password?
              </p>
            </form>
          )}

        {/* 2. Forgot Password Form (Enter Email) */}
        {showForgotPassword &&
          !showVerifyCodeForm &&
          !showSetNewPasswordForm && (
            <form
              className='reset-password-form-content'
              onSubmit={handleForgotPassword}>
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

              <p className='back-to-login-link' onClick={backToLogin}>
                Back to Login
              </p>
            </form>
          )}

        {/* 3. Verify Code Form */}
        {showVerifyCodeForm && (
          <form
            className='verify-code-form-content'
            onSubmit={handleVerifyCode}>
            <h2 className='verify-code-title'>Verify Reset Code</h2>

            <div className='input-field-group'>
              <label htmlFor='reset-code-input'>
                Enter the code sent to {resetEmail}
              </label>
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

        {/* 4. Set New Password Form */}
        {showSetNewPasswordForm && (
          <form
            className='set-new-password-form-content'
            onSubmit={handleSetNewPassword}>
            <h2 className='set-new-password-title'>Set New Password</h2>

            <div
              className={`input-field-group password-field-group`}
              style={{ position: 'relative' }}>
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
              <span
                onClick={() => setShowNewPassword(!showNewPassword)}
                className='password-toggle-icon'>
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <div
              className={`input-field-group password-field-group`}
              style={{ position: 'relative' }}>
              <label htmlFor='confirm-new-password-input'>
                Confirm New Password
              </label>
              <input
                id='confirm-new-password-input'
                type={showConfirmNewPassword ? 'text' : 'password'}
                placeholder='Confirm new password'
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
                style={{ paddingRight: '35px' }}
              />
              <span
                onClick={() =>
                  setShowConfirmNewPassword(!showConfirmNewPassword)
                }
                className='password-toggle-icon'>
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
  )
}

export default Login
