
// db.js
const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'loyaltydb',
  user: 'loyaltyuser',
  password: 'akun2234'
});

module.exports = pool;

