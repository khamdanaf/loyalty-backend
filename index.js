
// index.js
// Backend sederhana untuk OTP WA + loyalty form (versi pondasi)

// 1. Import dan setup dasar
require('dotenv').config();

const express = require('express');
const pool = require('./db');
const app = express();

// Supaya backend bisa baca JSON dari body request
app.use(express.json());

// 2. Store di memory (sementara, nanti bisa diganti DB/Redis)
const otpStore = new Map();      // phone -> { otp, expiresAt }
const verifiedPhones = new Set(); // daftar nomor yang sudah lolos OTP

// 3. Health check (buat cek server hidup)
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

/**
 * 4. Endpoint kirim OTP
 *    POST /api/otp/send
 *    Body: { "phone": "6281234567890" }
 */
app.post('/api/otp/send', (req, res) => {
  const { phone } = req.body;

  // Validasi sederhana
  if (!phone) {
    return res.status(400).json({
      success: false,
      message: 'Phone is required'
    });
  }

  // Generate OTP 4 digit
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000; // berlaku 5 menit

  // Simpan di memory
  otpStore.set(phone, { otp, expiresAt });

  // TODO: ganti ini dengan kirim OTP via WhatsApp (Qontak / provider lain)
  console.log(`OTP untuk ${phone}: ${otp}`);

  return res.json({
    success: true,
    message: 'OTP generated (cek log server dulu)'
  });
});

/**
 * 5. Endpoint verifikasi OTP
 *    POST /api/otp/verify
 *    Body: { "phone": "6281234567890", "otp": "1234" }
 */
app.post('/api/otp/verify', (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({
      verified: false,
      message: 'Phone and otp are required'
    });
  }

  const record = otpStore.get(phone);
  if (!record) {
    return res.status(400).json({
      verified: false,
      message: 'OTP not found for this phone'
    });
  }

  // Cek expired
  if (Date.now() > record.expiresAt) {
    otpStore.delete(phone);
    return res.status(400).json({
      verified: false,
      message: 'OTP expired'
    });
  }

  // Cek kecocokan OTP
  if (record.otp !== otp) {
    return res.status(400).json({
      verified: false,
      message: 'OTP is wrong'
    });
  }

  // Kalau sampai sini, OTP benar
  otpStore.delete(phone);   // hapus supaya tidak bisa dipakai ulang
  verifiedPhones.add(phone); // tandai nomor ini sudah verified

  return res.json({
    verified: true,
    message: 'OTP verified'
  });
});

/**
 * 6. Endpoint submit loyalty form
 *    POST /api/loyalty/submit
 *    Body contoh:
 *    {
 *      "name": "Khamdan",
 *      "phone": "6281234567890",
 *      "dateOfBirth": "1995-01-01"
 *    }
 */
app.post('/api/loyalty/submit', async (req, res) => {
  const { name, phone, dateOfBirth } = req.body;

  if (!name || !phone) {
    return res.status(400).json({
      status: 'error',
      message: 'Name and phone are required'
    });
  }

  // Pastikan nomor sudah lewat proses OTP
  if (!verifiedPhones.has(phone)) {
    return res.status(400).json({
      status: 'error',
      message: 'Phone is not verified by OTP'
    });
  }

  try {
    await pool.query(
      'INSERT INTO loyalty_submissions (name, phone, date_of_birth) VALUES ($1, $2, $3)',
      [name, phone, dateOfBirth || null]
    );

    // Optional: setelah disimpan, hapus status verified
    // verifiedPhones.delete(phone);

    return res.json({ status: 'ok' });
  } catch (err) {
    console.error('Error insert loyalty:', err);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});


// 7. Jalankan server
const PORT = 4000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Loyalty backend running at http://localhost:${PORT}`);
});

