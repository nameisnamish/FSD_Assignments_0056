const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

function createToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );
}

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

router.post('/register', async (request, response, next) => {
  try {
    const { name, email, password, role } = request.body;
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

    if (!name || !normalizedEmail || !password) {
      return response.status(400).json({
        success: false,
        message: 'Name, email, and password are required.',
      });
    }

    if (role && role !== 'student') {
      return response.status(400).json({
        success: false,
        message: 'New accounts can only be registered with the student role.',
      });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return response.status(409).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: 'student',
    });

    return response.status(201).json({
      success: true,
      message: 'Registration successful.',
      data: { user: publicUser(user), token: createToken(user) },
    });
  } catch (error) {
    if (error.code === 11000) {
      return response.status(409).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }
    return next(error);
  }
});

router.post('/login', async (request, response, next) => {
  try {
    const { email, password } = request.body;
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (!user || typeof password !== 'string' || !(await bcrypt.compare(password, user.password))) {
      return response.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    return response.json({
      success: true,
      message: 'Login successful.',
      data: { user: publicUser(user), token: createToken(user) },
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
