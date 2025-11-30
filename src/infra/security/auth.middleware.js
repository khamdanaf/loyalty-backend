// src/infra/security/auth.middleware.js
const { verifyAccessToken } = require('../../core/services/auth.service');
const { UnauthorizedError } = require('../../core/errors/httpErrors');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {

    return next(new UnauthorizedError('Missing or invalid Authorization header'));
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    return next();
  } catch (err) {
    return next(new UnauthorizedError('Invalid or expired token'));
  }
}

module.exports = { authMiddleware };
