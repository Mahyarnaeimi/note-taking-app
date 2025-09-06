// middlewares/error.js

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const notFound = (req, res, next) => {
  res.status(404).format({
    json: () => res.json({ error: 'Not Found' }),
    html: () => res.sendFile(path.join(__dirname, '../public/404.html')),
    default: () => res.json({ error: 'Not Found' })
  });
};

export const errorHandler = (err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'Server Error'
  });
};