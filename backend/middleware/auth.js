const jwt = require('jsonwebtoken');
const store = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'drishtiai_super_secure_key_2026';

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({
      error: 'Authentication required. No token provided.',
      code: 'AUTH_REQUIRED'
    });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        error: 'Invalid or expired session token. Please log in again.',
        code: 'TOKEN_INVALID'
      });
    }

    req.user = decoded;
    next();
  });
}

// Middleware to authorize specific user roles
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Access denied. Requires one of roles: ${allowedRoles.join(', ')}`,
        code: 'FORBIDDEN_ROLE'
      });
    }
    next();
  };
}

// In-memory sliding-window IP rate limiter
const ipRequestHistory = new Map();

function rateLimiter({ windowMs = 60000, maxRequests = 60, message = 'Too many requests. Please slow down.' }) {
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress || 'unknown-ip';
    const now = Date.now();

    if (!ipRequestHistory.has(ip)) {
      ipRequestHistory.set(ip, []);
    }

    const timestamps = ipRequestHistory.get(ip).filter(ts => now - ts < windowMs);
    if (timestamps.length >= maxRequests) {
      return res.status(429).json({
        error: message,
        retryAfterSec: Math.ceil((windowMs - (now - timestamps[0])) / 1000)
      });
    }

    timestamps.push(now);
    ipRequestHistory.set(ip, timestamps);
    next();
  };
}

// Helper to log audit trail
function auditLog(req, action, details) {
  const actorId = req.user ? (req.user.patientId || req.user.id) : (req.body?.patientId || req.body?.mobile || req.body?.email || 'anonymous');
  const actorRole = req.user ? req.user.role : (req.body?.role || 'public');
  const actorName = req.user ? req.user.name : (req.body?.name || 'Visitor');
  return store.logAudit(actorId, actorRole, actorName, action, details);
}

module.exports = {
  JWT_SECRET,
  authenticateToken,
  requireRole,
  rateLimiter,
  auditLog
};
