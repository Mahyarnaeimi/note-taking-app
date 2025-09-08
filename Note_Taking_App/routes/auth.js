// routes/auth.js
import { Router } from 'express';
import passport from 'passport';
import bcrypt from 'bcryptjs';
import User from '../models/user.js'; // دقت کن U بزرگ باشه و مسیر درست

const router = Router();

/**
 * Local Login
 */
router.post('/login', async (req, res, next) => {
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
      return res.redirect('/dashboard'); // 👈 بعد از لاگین برو به داشبورد
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Register Page
 */
router.get('/register', (req, res) => {
  res.render('register', { error: req.query.error || null });
});

/**
 * Register Submit
 */
router.post('/register', async (req, res, next) => {
  const { email, password, displayName } = req.body;
  try {
    // چک کن که کاربر وجود نداشته باشه
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
});

/**
 * Forgot Password Page
 */
router.get('/forgot-password', (req, res) => {
  res.render('forgot-password', {
    error: req.query.error || null,
    message: null,
  });
});

/**
 * Forgot Password Submit
 */
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  // فعلاً فقط پیام عمومی نشون می‌دیم (بدون ارسال ایمیل)
  const message = 'A reset link has been sent to your email address.';

  res.render('forgot-password', { error: null, message });
});

/**
 * Google OAuth Login
 */
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/dashboard'); // 👈 بعد از لاگین با گوگل هم برو به داشبورد
  }
);

/**
 * Logout
 */
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/');
  });
});

export default router;
