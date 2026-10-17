import { UniqueConstraintError } from 'sequelize';
import { UNIQUE_CONSTRAINTS } from '../config/constants.js';
import { messages } from '../config/messages.js';
import { ApiError } from '../utils/ApiError.js';
import { sendError } from '../utils/response.js';

const UNIQUE_CONSTRAINT_MESSAGES = Object.freeze({
  [UNIQUE_CONSTRAINTS.BOOKING_SLOT]: messages.booking.slotTaken,
  [UNIQUE_CONSTRAINTS.DAY_OFF_DATE]: messages.dayOff.duplicate,
  [UNIQUE_CONSTRAINTS.USER_EMAIL]: messages.team.emailTaken,
});

const isClientError = (status) => status >= 400 && status < 500;

const toApiError = (error) => {
  if (error instanceof ApiError) return error;
  if (error instanceof UniqueConstraintError) {
    return ApiError.conflict(UNIQUE_CONSTRAINT_MESSAGES[error.parent?.constraint]);
  }
  if (isClientError(error.status)) return new ApiError(error.status, messages.common.badRequest);
  return ApiError.internal();
};

export const errorHandler = (error, _req, res, _next) => {
  const apiError = toApiError(error);
  if (!isClientError(apiError.status)) console.error(error);
  sendError(res, apiError.status, apiError.message, apiError.data);
};
