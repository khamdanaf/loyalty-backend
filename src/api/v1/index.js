// src/api/v1/index.js
const express = require('express');
const { otpRouter } = require('./otp/otp.router');
const { loyaltyRouter } = require('./loyalty/loyalty.router');

const v1Router = express.Router();

v1Router.use('/otp', otpRouter);
v1Router.use('/loyalty', loyaltyRouter);

module.exports = { v1Router };
