// controllers/authController.js

import bcrypt from 'bcryptjs';
import User from '../models/user.js';

// POST '/login' - Local Login
export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user || !user.password) {
      return res.redirect('/?error=Invalid credentials');
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.redirect('/?error=Invalid credentials');
    }

    req.login(user, (err) => {
      if (err) return next(err);
      return res.redirect('/dashboard');
    });
  } catch (err) {
    next(err);
  }
};

// GET '/register' - Register Page
export const getRegisterPage = (req, res) => {
  res.render('register', {
    error: req.query.error || null,
    user: req.user || null,
  });
};

// POST '/register' - Register Submit
export const registerUser = async (req, res, next) => {
  const { email, password, displayName } = req.body;
  try {
    // check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.redirect('/register?error=User already exists');
    }

    const hash = await bcrypt.hash(password, 12);
    const user = await User.create({ email, password: hash, displayName });

    req.login(user, (err) => {
      if (err) return next(err);
      return res.redirect('/dashboard');
    });
  } catch (err) {
    next(err);
  }
};

// GET '/forgot-password' - Forgot Password Page
export const getForgotPasswordPage = (req, res) => {
  res.render('forgot-password', {
    error: req.query.error || null,
    message: null,
    user: req.user || null,
  });
};

// POST '/forgot-password' - Forgot Password Submit
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      // Normally: generate reset token + send email
      console.log(`Password reset requested for ${email}`);
    }

    const message = 'A reset link has been sent to your email address.';
    res.render('forgot-password', {
      error: null,
      message,
      user: req.user || null,
    });
  } catch (err) {
    next(err);
  }
};

// GET '/logout' - Logout
export const logoutUser = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/');
  });
};
