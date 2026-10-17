import { messages } from '../config/messages.js';

export class ApiError extends Error {
  constructor(status, message, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }

  static badRequest(message = messages.common.badRequest, data = null) {
    return new ApiError(400, message, data);
  }

  static unauthorized(message = messages.auth.unauthorized) {
    return new ApiError(401, message);
  }

  static forbidden(message = messages.auth.forbidden, data = null) {
    return new ApiError(403, message, data);
  }

  static notFound(message = messages.common.notFound) {
    return new ApiError(404, message);
  }

  static conflict(message = messages.common.duplicate, data = null) {
    return new ApiError(409, message, data);
  }

  static internal() {
    return new ApiError(500, messages.common.serverError);
  }
}
