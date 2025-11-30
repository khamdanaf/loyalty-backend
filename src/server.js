// src/server.js
require('dotenv').config();
const express = require('express');
const { config } = require('./config');
const { httpLogger, logger } = require('./infra/logger');
const { v1Router } = require('./api/v1');
const { HttpError } = require('./core/errors/httpErrors');

const app = express();

// Middleware
app.use(express.json());
app.use(httpLogger);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// API v1
app.use('/api/v1', v1Router);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  if (err instanceof HttpError) {
    logger.warn({ err }, 'HttpError handled');
    return res.status(err.statusCode).json({
      message: err.message,
      details: err.details ?? undefined
    });
  }

  logger.error({ err }, 'Unexpected error');

  // Di development, kirim detail error biar mudah debug
  const { config } = require('./config');
  if (config.env !== 'production') {
    return res.status(500).json({
      message: err.message,
      stack: err.stack
    });
  }

  // Di production, jangan bocorin detail
  return res.status(500).json({ message: 'Internal server error' });
});



// Start server
app.listen(config.port, () => {
  logger.info(`Loyalty backend running at http://localhost:${config.port}`);
});
