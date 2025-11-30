// src/api/v1/otp/otp.controller.js
const { z } = require('zod');
const { BadRequestError } = require('../../../core/errors/httpErrors');
const { signAccessToken } = require('../../../core/services/auth.service');
const { logger } = require('../../../infra/logger');

// In-memory store
const otpStore = new Map();      // phone -> { otp, expiresAt }
const verifiedPhones = new Set(); // phone set

const sendOtpSchema = z.object({
  phone: z.string().min(8, 'Nomor HP tidak valid')
});

const verifyOtpSchema = z.object({
  phone: z.string().min(8),
  otp: z.string().length(4, 'OTP harus 4 digit')
});

function generateOtp() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

async function sendOtp(req, res, next) {
  try {
    const { phone } = sendOtpSchema.parse(req.body);

    const otp = generateOtp();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 menit

    otpStore.set(phone, { otp, expiresAt });
    logger.info({ phone, otp }, 'Generated OTP (sementara masih log, nanti diganti WA API)');

    return res.json({
      success: true,
      message: 'OTP generated (cek log server dulu)'
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return next(new BadRequestError('Invalid request body', err.flatten()));
    }
    return next(err);
  }
}

async function verifyOtp(req, res, next) {
  try {
    const { phone, otp } = verifyOtpSchema.parse(req.body);

    const record = otpStore.get(phone);
    if (!record) {
      throw new BadRequestError('OTP not found, please request again');
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(phone);
      throw new BadRequestError('OTP expired, please request again');
    }

    if (record.otp !== otp) {
      throw new BadRequestError('OTP is wrong');
    }

    // Phone berhasil diverifikasi
    verifiedPhones.add(phone);
    otpStore.delete(phone);

    // Buat JWT
    const accessToken = signAccessToken({ phone });

    return res.json({
      verified: true,
      message: 'OTP verified',
      accessToken
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return next(new BadRequestError('Invalid request body', err.flatten()));
    }
    return next(err);
  }
}

module.exports = {
  sendOtp,
  verifyOtp,
  verifiedPhones
};
