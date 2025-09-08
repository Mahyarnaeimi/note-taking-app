// routes/auth.js

import { Router } from 'express';
import passport from 'passport';
import User from '../models/user.js';
import bcrypt from 'bcryptjs';

const router = Router();

// local login
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user || !user.password) {
      return res.redirect("/?error=Invalid credentials");
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.redirect("/?error=Invalid credentials");
    }
    req.login(user, (err) => {
      if (err) return next(err);
      return res.redirect('/'); 
    });
  } catch (error) {
    next(error);
  }
});


// register
router.post("/register", async (req, res, next) => {
  const { email, password, displayName } = req.body;
  try {
    const hash = await bcrypt.hash(password, 12);
    const user = await User.create({ email, password: hash, displayName });
    req.login(user, (err) => {
      if (err) return next(err);
      return res.redirect('/');
    });
  } catch (error) {
    return res.redirect("/register?error=User already exists");
  }
});

// forget password
router.post("/forgot-password", async (req, res) => {
  res.render("forgot-password");
});

// Login with Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/'); // Redirect to homepage or dashboard after successful login
  }
);

// Logout
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
});

export default router;
