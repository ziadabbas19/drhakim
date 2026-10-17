import { messages } from '../i18n/index.js';

// `message` is a translation key; it is rendered in the request's language by the error handler.
export class ApiError extends Error {
  constructor(status, message, data = null, params = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
    this.params = params;
  }

  static badRequest(message = messages.common.badRequest, data = null, params = null) {
    return new ApiError(400, message, data, params);
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

  static conflict(message = messages.common.duplicate, data = null, params = null) {
    return new ApiError(409, message, data, params);
  }

  static tooLarge(message, params = null) {
    return new ApiError(413, message, null, params);
  }

  static badGateway(message) {
    return new ApiError(502, message);
  }

  static internal() {
    return new ApiError(500, messages.common.serverError);
  }
}
