const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// @desc    Login admin
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide email and password');
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });

    if (!admin || !(await admin.matchPassword(password))) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    res.json({
      success: true,
      data: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        token: generateToken(admin._id),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in admin
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    res.json({ success: true, data: req.admin });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password (demo - generates a reset token, would email in production)
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const admin = await Admin.findOne({ email: email?.toLowerCase() });

    if (!admin) {
      res.status(404);
      throw new Error('No admin account found with that email');
    }

    // In production: generate reset token, email a reset link.
    // For this demo project we simply acknowledge the request.
    res.json({
      success: true,
      message: 'If an account exists with this email, password reset instructions have been sent.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register new admin (only used for initial setup/seed)
// @route   POST /api/auth/register
// @access  Public (should be restricted/disabled in real production)
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const exists = await Admin.findOne({ email: email?.toLowerCase() });
    if (exists) {
      res.status(400);
      throw new Error('Admin with this email already exists');
    }
    const admin = await Admin.create({ name, email, password });
    res.status(201).json({
      success: true,
      data: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        token: generateToken(admin._id),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { login, getMe, forgotPassword, register };
