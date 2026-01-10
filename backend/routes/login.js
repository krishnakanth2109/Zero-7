import express from 'express';
import Users from '../models/User.js';
import jwtToken from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// @route   POST /api/user/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (request, response) => {
  const { name, email, role, employeeId, password } = request.body;

  try {
    const checkUserExists = await Users.findOne({ $or: [{ email }, { employeeId }] });
    if (checkUserExists) {
      return response.status(400).json({
        message: `A user with this email or employee ID already exists.`,
      });
    }
    
    const newUser = new Users({
      name,
      email,
      role,
      employeeId,
      password, // Pre-save hook will hash this
    });
    
    await newUser.save();
    response.status(201).json({ message: 'User Created Successfully' });

  } catch (error) {
    console.error("Registration Error:", error);
    response.status(500).json({ message: 'Server error during registration.' });
  }
});

// @route   POST /api/user/login
// @desc    Authenticate user and get token
// @access  Public
router.post('/login', async (request, response) => {
  const { email, password } = request.body;

  if (!email || !password) {
    return response.status(400).json({ message: 'Please provide an email and password.' });
  }

  try {
    const user = await Users.findOne({
      $or: [{ email }, { employeeId: email }],
    }).select('+password'); 

    if (!user) {
      return response.status(401).json({ message: 'Invalid credentials. Please try again.' });
    }

    const isPasswordMatch = await user.matchPassword(password);

    if (!isPasswordMatch) {
      return response.status(401).json({ message: 'Invalid credentials. Please try again.' });
    }

    const userPayload = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      employeeId: user.employeeId,
    };

    const token = jwtToken.sign(userPayload, process.env.MY_SECRET_KEY, { expiresIn: '1d' });

    response.json({ user: userPayload, token });

  } catch (error) {
    console.error("Login Server Error:", error);
    response.status(500).json({ message: 'An internal server error occurred.' });
  }
});

// @route   POST /api/user/forgot-password
// @desc    Send a password reset OTP
// @access  Public
router.post('/forgot-password', async (request, response) => {
  const { email } = request.body;
  
  try {
    const user = await Users.findOne({ email });
    if (!user) {
      return response.status(404).json({ message: 'User with that email not found.' });
    }
    
    const otp = crypto.randomInt(100000, 999999).toString();
    user.passwordResetOTP = otp;
    user.passwordResetExpires = Date.now() + 600000; // 10 minutes
    await user.save();

    console.log(`OTP for ${user.email}: ${otp}`);
    
    response.json({ message: 'An OTP has been sent to your email.' });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    response.status(500).json({ message: 'Server error during password reset request.' });
  }
});

// @route   POST /api/user/verify-otp
// @desc    Verify OTP
// @access  Public
router.post('/verify-otp', async (request, response) => {
  const { email, otp } = request.body;
  
  try {
    const user = await Users.findOne({
      email,
      passwordResetOTP: otp,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return response.status(400).json({ message: 'Invalid or expired OTP.' });
    }

    const resetToken = jwtToken.sign(
      { email: user.email, purpose: 'password-reset' },
      process.env.MY_SECRET_KEY,
      { expiresIn: '15m' }
    );

    response.json({ 
      message: 'OTP Verified Successfully',
      token: resetToken 
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    response.status(500).json({ message: 'Server error during OTP verification.' });
  }
}); 

// @route   POST /api/user/reset-password
// @desc    Reset password (Self-Service)
// @access  Public (requires OTP token)
router.post('/reset-password', async (request, response) => {
  const { email, password } = request.body;
  
  try {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return response.status(401).json({ message: 'No authorization token provided.' });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    
    try {
      decoded = jwtToken.verify(token, process.env.MY_SECRET_KEY);
    } catch (err) {
      return response.status(401).json({ message: 'Invalid or expired reset token.' });
    }

    if (decoded.purpose !== 'password-reset' || decoded.email !== email) {
      return response.status(401).json({ message: 'Invalid reset token.' });
    }

    const user = await Users.findOne({ 
      email,
      passwordResetExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return response.status(400).json({ message: 'Password reset session expired. Please request a new OTP.' });
    }
    
    user.password = password;
    user.passwordResetOTP = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    
    response.json({ message: 'Password has been reset successfully.' });
  } catch (error) {
    console.error("Reset Password Error:", error);
    response.status(500).json({ message: 'Server error while resetting password.' });
  }
});

// @route   GET /api/user/:id
// @desc    Get user details
// @access  Protected
router.get('/:id', async (request, response) => {
  try {
    const user = await Users.findById(request.params.id).select('-password');
    if (!user) {
      return response.status(404).json({ message: 'User not found.' });
    }
    response.json(user);
  } catch (err) {
    console.error("Get User Error:", err);
    response.status(500).json({ message: 'Server error' });
  }
});

// ---------------------------------------------------------
// [FIXED] PATCH /api/user/:id
// @desc    Update user details (Including Password for Admins)
// @access  Protected
// ---------------------------------------------------------
router.patch('/:id', async (request, response) => {
  try {
    const { name, email, role, password } = request.body;

    // 1. Find the user first
    const user = await Users.findById(request.params.id);
    if (!user) {
      return response.status(404).json({ message: 'User not found.' });
    }

    // 2. Update fields if provided
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;

    // 3. Handle Password Update (If sent by Admin)
    if (password && password.trim().length > 0) {
      // Just set the plain text password. 
      // The User model's 'pre-save' hook will automatically hash it.
      user.password = password;
    }

    // 4. Save using user.save() to trigger hooks/validation
    await user.save();

    // 5. Return updated user without password
    const updatedUser = user.toObject();
    delete updatedUser.password;

    response.json(updatedUser);

  } catch (err) {
    console.error("Update User Error:", err);
    response.status(500).json({ message: 'Server error updating user.' });
  }
});

export default router;