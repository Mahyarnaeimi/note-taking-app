// middlewares/auth.js

export const ensureAuth = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  // اگر درخواست HTML باشه → redirect
  if (req.accepts('html')) {
    return res.redirect('/?error=Please login first');
  }

  // اگر API (JSON) باشه → status code
  res.status(401).json({ message: 'Unauthorized' });
};
