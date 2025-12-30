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
    
    // ✅ FIXED: Don't hash here - let the pre-save hook handle it
    const newUser = new Users({
      name,
      email,
      role,
      employeeId,
      password, // Just pass the plain password
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
  // ✅ FIXED: Changed from 'identifier' to 'email' to match frontend
  const { email, password } = request.body;

  if (!email || !password) {
    return response.status(400).json({ message: 'Please provide an email and password.' });
  }

  try {
    // ✅ FIXED: Search by email OR employeeId (treating email field as identifier)
    const user = await Users.findOne({
      $or: [{ email }, { employeeId: email }],
    }).select('+password'); 

    if (!user) {
      return response.status(401).json({ message: 'Invalid credentials. Please try again.' });
    }

    // Compare password using the model's method
    const isPasswordMatch = await user.matchPassword(password);

    if (!isPasswordMatch) {
      return response.status(401).json({ message: 'Invalid credentials. Please try again.' });
    }

    // ✅ FIXED: Changed 'payload' to 'user' to match frontend expectation
    const userPayload = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      employeeId: user.employeeId,
    };

    const token = jwtToken.sign(userPayload, process.env.MY_SECRET_KEY, { expiresIn: '1d' });

    // Send response with 'user' key instead of 'payload'
    response.json({ user: userPayload, token });

  } catch (error) {
    console.error("Login Server Error:", error);
    response.status(500).json({ message: 'An internal server error occurred.' });
  }
});

// @route   POST /api/user/forgot-password
// @desc    Send a password reset OTP to the user's email
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

    // TODO: Integrate email sending service
    console.log(`OTP for ${user.email}: ${otp}`);
    
    response.json({ message: 'An OTP has been sent to your email.' });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    response.status(500).json({ message: 'Server error during password reset request.' });
  }
});

// @route   POST /api/user/verify-otp
// @desc    Verify the provided OTP
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

    // ✅ FIXED: Generate a temporary token for password reset
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
// @desc    Reset the user's password after OTP verification
// @access  Public (but requires valid reset token)
router.post('/reset-password', async (request, response) => {
  const { email, password } = request.body;
  
  try {
    // ✅ FIXED: Verify the reset token from Authorization header
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

    // ✅ FIXED: Also verify OTP hasn't expired
    const user = await Users.findOne({ 
      email,
      passwordResetExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return response.status(400).json({ message: 'Password reset session expired. Please request a new OTP.' });
    }
    
    // Update password - the pre-save hook will hash it
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
// @desc    Get a user's details by their ID
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

// @route   PATCH /api/user/:id
// @desc    Update a user's details
// @access  Protected
router.patch('/:id', async (request, response) => {
  try {
    delete request.body.password;

    const userUpdate = await Users.findByIdAndUpdate(
      request.params.id,
      { $set: request.body },
      { new: true, runValidators: true },
    ).select('-password');
    
    if (!userUpdate) {
      return response.status(404).json({ message: 'User not found.' });
    }

    response.json(userUpdate);
  } catch (err) {
    console.error("Update User Error:", err);
    response.status(500).json({ message: 'Server error' });
  }
});

export default router;