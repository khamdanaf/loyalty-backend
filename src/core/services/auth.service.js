// src/core/services/auth.service.js
const jwt = require('jsonwebtoken');
const { config } = require('../../config');

/**
 * Generate JWT access token
 * payload bisa berisi { phone, ... }
 */
function signAccessToken(payload) {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn
  });
}

/**
 * Verify JWT access token
 * melempar error kalau token invalid/expired
 */
function verifyAccessToken(token) {
  return jwt.verify(token, config.jwt.secret);
}

module.exports = {
  signAccessToken,
  verifyAccessToken
};
