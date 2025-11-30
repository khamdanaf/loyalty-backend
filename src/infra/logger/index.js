// src/infra/logger/index.js
const pino = require('pino');
const pinoHttp = require('pino-http');
const { config } = require('../../config');

const logger = pino({
  level: config.env === 'production' ? 'info' : 'debug',
  transport: config.env === 'production'
    ? undefined
    : {
        target: 'pino-pretty',
        options: { colorize: true, translateTime: true }
      }
});

const httpLogger = pinoHttp({
  logger
});

module.exports = { logger, httpLogger };
