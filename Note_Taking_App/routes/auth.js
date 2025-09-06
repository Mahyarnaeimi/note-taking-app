// routes/auth.js

import { Router } from 'express';
import passport from 'passport';

const router = Router();

// Login with Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/'); // می‌تونی به داشبورد هدایت کنی
  }
);

export default router;
// Logout
