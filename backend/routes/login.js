import express from 'express';
import Users from '../models/User.js'; // Assuming User.js is in ../models/
import jwtToken from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// @route   POST /api/user/register
// @desc    Register a new user
// @access  Public (or protected by admin middleware if needed)
router.post('/register', async (request, response) => {
  const { name, email, role, employeeId, password } = request.body;

  try {
    const checkUserExists = await Users.findOne({ $or: [{ email }, { employeeId }] });
    if (checkUserExists) {
      return response.status(400).json({
        message: `A user with this email or employee ID already exists.`,
      });
    }
    
    // Note: If your User model has a pre-save hook for hashing, you don't need to hash here.
    // This code assumes manual hashing or a model without the hook.
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new Users({
      name,
      email,
      role,
      employeeId,
      password: hashedPassword,
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
  const { identifier, password } = request.body;

  if (!identifier || !password) {
    return response.status(400).json({ message: 'Please provide an identifier and password.' });
  }

  try {
    // Find the user by either email or employeeId
    // IMPORTANT: .select('+password') is needed if your model schema has 'select: false' on the password field.
    const user = await Users.findOne({
      $or: [{ email: identifier }, { employeeId: identifier }],
    }).select('+password'); 

    // For security, give a generic error message if user is not found
    if (!user) {
      return response.status(401).json({ message: 'Invalid credentials. Please try again.' });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return response.status(401).json({ message: 'Invalid credentials. Please try again.' });
    }

    // If credentials are correct, create the JWT payload
    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      employeeId: user.employeeId,
    };

    const token = jwtToken.sign(payload, process.env.MY_SECRET_KEY, { expiresIn: '1d' });

    // Send the token and user data back to the frontend
    response.json({ user: payload, token });

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
  const user = await Users.findOne({ email });
  if (!user) {
    return response.status(404).json({ message: 'User with that email not found.' });
  }
  
  const otp = crypto.randomInt(100000, 999999).toString();
  user.passwordResetOTP = otp;
  user.passwordResetExpires = Date.now() + 600000; // 10 minutes from now
  await user.save();

  // Here you would integrate your email sending service (e.g., Nodemailer transporter)
  console.log(`OTP for ${user.email}: ${otp}`); // For testing purposes
  
  response.json({ message: 'An OTP has been sent to your email.' });
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
      passwordResetExpires: { $gt: Date.now() }, // Check if the OTP is not expired
    });

    if (user) {
      response.json({ message: 'OTP Verified Successfully' });
    } else {
      response.status(400).json({ message: 'Invalid or expired OTP.' });
    }
  } catch (error) {
    console.error("Verify OTP Error:", error);
    response.status(500).json({ message: 'Server error during OTP verification.' });
  }
});

// @route   POST /api/user/reset-password
// @desc    Reset the user's password after OTP verification
// @access  Public
router.post('/reset-password', async (request, response) => {
  const { email, password } = request.body;
  try {
    const user = await Users.findOne({ email }); // You might want to add OTP check here as well for security
    if (!user) {
      return response.status(404).json({ message: 'Invalid user.' });
    }
    
    const saltRounds = 10;
    user.password = await bcrypt.hash(password, saltRounds);
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
// @access  Protected (Requires authentication middleware)
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
// @access  Protected (Requires authentication middleware)
router.patch('/:id', async (request, response) => {
  try {
    // Prevent password from being updated through this route
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