// routes/auth.js

import { Router } from 'express';
import passport from 'passport';
import {
  postLocLog,
  getReg,
  postReg,
  getForPass,
  postForPass,
  getLogout,
} from '../controllers/authController.js';

const router = Router();

// Local Login
router.post('/login', postLocLog);

// Register Page
router.get('/register', getReg);

// Register Submit
router.post('/register', postReg);

// Forgot Password Page
router.get('/forgot-password', getForPass);

// Forgot Password Submit
router.post('/forgot-password', postForPass);

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
router.get('/logout', getLogout);

export default router;
