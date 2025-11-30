// src/api/v1/otp/otp.router.js
const express = require('express');
const { sendOtp, verifyOtp } = require('./otp.controller');

const router = express.Router();

router.post('/send', sendOtp);
router.post('/verify', verifyOtp);

module.exports = { otpRouter: router };
