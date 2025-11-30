// src/core/errors/httpErrors.js
class HttpError extends Error {
  constructor(statusCode, message, details) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace?.(this, this.constructor);
  }
}

class BadRequestError extends HttpError {
  constructor(message = 'Bad request', details) {
    super(400, message, details);
  }
}

class UnauthorizedError extends HttpError {
  constructor(message = 'Unauthorized', details) {
    super(401, message, details);
  }
}

class ForbiddenError extends HttpError {
  constructor(message = 'Forbidden', details) {
    super(403, message, details);
  }
}

class NotFoundError extends HttpError {
  constructor(message = 'Not found', details) {
    super(404, message, details);
  }
}

module.exports = {
  HttpError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError
};
