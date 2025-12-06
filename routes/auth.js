// routes/auth.js

import { Router } from 'express';
import passport from 'passport';
import {
  loginUser,
  getRegisterPage,
  registerUser,
  getForgotPasswordPage,
  forgotPassword,
  logoutUser,
} from '../controllers/authController.js';

const router = Router();

// Local Login
router.post('/login', loginUser);

// Register Page
router.get('/register', getRegisterPage);

// Register Submit
router.post('/register', registerUser);

// Forgot Password Page
router.get('/forgot-password', getForgotPasswordPage);

// Forgot Password Submit
router.post('/forgot-password', forgotPassword);

// Google OAuth Routes -- not in controller
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth Callback
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/dashboard'); // after logging in with Google, go to dashboard
  }
);

// Logout
router.get('/logout', logoutUser);

export default router;
