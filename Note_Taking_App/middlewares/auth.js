export const ensureAuth = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  // تغییر: اگر JSON خواستی می‌فرسته، اگر HTML باشه redirect کنه به صفحه login
  if (req.accepts('html')) {
    return res.redirect('/?error=Please login first');
  }
  res.status(401).json({ message: 'Unauthorized' });
};