// src/infra/db/index.js
const { Pool } = require('pg');
const { config } = require('../../config');
const { logger } = require('../logger');

const pool = new Pool({
  host: config.db.host,
  port: config.db.port,
  database: config.db.name,
  user: config.db.user,
  password: config.db.password
});

pool.on('error', (err) => {
  logger.error({ err }, 'Unexpected PG pool error');
});

module.exports = { pool };
