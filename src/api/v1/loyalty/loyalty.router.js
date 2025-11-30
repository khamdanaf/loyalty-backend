// src/api/v1/loyalty/loyalty.router.js
const express = require('express');
const { submitLoyalty } = require('./loyalty.controller');
// const { authMiddleware } = require('../../../infra/security/auth.middleware');

const router = express.Router();

// Kalau mau pakai JWT full:
// router.post('/submit', authMiddleware, submitLoyalty);
router.post('/submit', submitLoyalty);

module.exports = { loyaltyRouter: router };
