const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'UNAUTHORIZED', message: 'Bearer token required' });
  }
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'change-me');
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'INVALID_TOKEN', message: 'Access token is invalid or expired' });
  }
}

function optionalAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  if (scheme === 'Bearer' && token) {
    try { req.user = jwt.verify(token, process.env.JWT_SECRET || 'change-me'); } catch (_) {}
  }
  next();
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'FORBIDDEN', message: 'Insufficient role' });
    }
    next();
  };
}

function requireInternal(req, res, next) {
  const expected = process.env.INTERNAL_SERVICE_TOKEN || 'megamart-local-service-token-change-me';
  if (req.headers['x-service-token'] !== expected) {
    return res.status(403).json({ error: 'FORBIDDEN', message: 'Internal service token required' });
  }
  next();
}

module.exports = { requireAuth, optionalAuth, requireRole, requireInternal };
