import React, { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import Cookie from 'js-cookie'
import './css/Login.css'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [resetEmail, setResetEmail] = useState('')
  const [error, setError] = useState('')
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const [isLoading, setIsLoading] = useState(false) // For loading animation
  const navigate = useNavigate()

  // Function to determine if inputs should be blurred

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    // Start loading animation

    const payload = { email, password } // Include selected role
    let endPoint = '/user/login'
    const url = process.env.REACT_APP_API_URL
      ? `${process.env.REACT_APP_API_URL}${endPoint}`
      : `http://localhost:5000/api${endPoint}`

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
        console.log(data.user) // This might need to be dynamic based on role
        console.log('Login successful, navigating to dashboard...')
        navigate('/admin/dashboard')
      } else {
        setError(data.message || 'Login failed. Please check your credentials.')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false) // Stop loading animation
    }
  }

  const handleForgotPassword = (e) => {
    e.preventDefault()
    alert(`Password reset link sent to: ${resetEmail}`)
    setShowForgotPassword(false)
    setResetEmail('')
  }

  // Dynamic styling for login button

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

            {error && <p className='error-message-text'>{error}</p>}

            <button type='submit' className='submit-login-button'>
              Log In to Dashboard
            </button>

            <p
              className='forgot-password-link'
              onClick={() => setShowForgotPassword(true)}>
              Forgot Password?
            </p>
          </form>
        ) : (
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

            <p
              className='back-to-login-link'
              onClick={() => setShowForgotPassword(false)}>
              Back to Login
            </p>
          </form>
        )}
      </div>
    </div>
  )
}

export default Login
