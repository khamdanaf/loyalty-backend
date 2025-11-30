// db.js
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'loyaltydb',
  user: process.env.DB_USER || 'loyaltyuser',
  password: process.env.DB_PASSWORD || 'akun1111'
});

module.exports = pool;
