// middlewares/error.js
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;

  if (req.accepts('html')) {
    return res.status(status).send(`
      <h1>${status} - ${err.message || 'Server Error'}</h1>
      <p>Something went wrong. Please try again later.</p>
    `);
  }

  res.status(status).json({
    error: err.message || 'Server Error'
  });
};