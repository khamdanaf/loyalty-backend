// src/api/v1/loyalty/loyalty.controller.js
const { z } = require('zod');
const {
  BadRequestError,
  UnauthorizedError
} = require('../../../core/errors/httpErrors');
const { pool } = require('../../../infra/db');
const { verifiedPhones } = require('../otp/otp.controller');
const { logger } = require('../../../infra/logger');

// Schema validasi body request
const loyaltySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(8, 'Phone is required'),
  dateOfBirth: z.string().optional()
});

async function submitLoyalty(req, res, next) {
  try {
    // Validasi body
    const { name, phone, dateOfBirth } = loyaltySchema.parse(req.body);

    // Pastikan nomor sudah diverifikasi OTP
    if (!verifiedPhones.has(phone)) {
      throw new UnauthorizedError('Phone is not verified by OTP');
    }

    // Tulis ke database
    try {
      await pool.query(
        'INSERT INTO loyalty_submissions (name, phone, date_of_birth) VALUES ($1, $2, $3)',
        [name, phone, dateOfBirth || null]
      );
    } catch (dbErr) {
      logger.error({ err: dbErr }, 'Database error in submitLoyalty');
      return next(dbErr);
    }

    return res.json({ status: 'ok' });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return next(new BadRequestError('Invalid request body', err.flatten()));
    }
    return next(err);
  }
}

module.exports = {
  submitLoyalty
};
