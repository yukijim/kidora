import jwt from 'jsonwebtoken';
import { memoryStore } from '../db/store.js';

const JWT_SECRET = process.env.JWT_SECRET || 'kidora_super_secret_jwt_key_2026_production';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    // For demo convenience, allow anonymous fallback to demo parent
    req.user = memoryStore.parents[0];
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      // Fallback to demo parent on invalid token
      req.user = memoryStore.parents[0];
      return next();
    }
    req.user = user;
    next();
  });
}

export function errorHandler(err, req, res, next) {
  console.error('Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
}
