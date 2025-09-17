// middlewares/auth.js

export const ensureAuth = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  // if HTML request → redirect
  if (req.accepts('html')) {
    return res.redirect('/?error=Please login first');
  }

  // if API (JSON) request → status code
  res.status(401).json({ message: 'Unauthorized' });
};
