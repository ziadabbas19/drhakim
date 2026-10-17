import multer from 'multer';
import { ForeignKeyConstraintError, UniqueConstraintError } from 'sequelize';
import { FOREIGN_KEYS, MEDIA, UNIQUE_CONSTRAINTS } from '../config/constants.js';
import { env } from '../config/env.js';
import { messages, translate } from '../i18n/index.js';
import { ApiError } from '../utils/ApiError.js';
import { sendError } from '../utils/response.js';

const UNIQUE_CONSTRAINT_MESSAGES = Object.freeze({
  [UNIQUE_CONSTRAINTS.BOOKING_SLOT]: messages.booking.slotTaken,
  [UNIQUE_CONSTRAINTS.DAY_OFF_DATE]: messages.dayOff.duplicate,
  [UNIQUE_CONSTRAINTS.USER_EMAIL]: messages.team.emailTaken,
});

const FOREIGN_KEY_MESSAGES = Object.freeze({
  [FOREIGN_KEYS.MEDIA_LINK_MEDIA]: messages.media.notFound,
});

const UPLOAD_ERRORS = Object.freeze({
  LIMIT_FILE_SIZE: () => ApiError.tooLarge(messages.media.tooLarge, { max: env.uploads.maxMegabytes }),
  LIMIT_FILE_COUNT: () => ApiError.badRequest(messages.media.tooMany, null, { max: MEDIA.maxFilesPerUpload }),
  LIMIT_UNEXPECTED_FILE: () => ApiError.badRequest(messages.media.tooMany, null, { max: MEDIA.maxFilesPerUpload }),
});

const isClientError = (status) => status >= 400 && status < 500;

const toApiError = (error) => {
  if (error instanceof ApiError) return error;
  if (error instanceof UniqueConstraintError) {
    return ApiError.conflict(UNIQUE_CONSTRAINT_MESSAGES[error.parent?.constraint]);
  }
  if (error instanceof ForeignKeyConstraintError && FOREIGN_KEY_MESSAGES[error.parent?.constraint]) {
    return ApiError.badRequest(FOREIGN_KEY_MESSAGES[error.parent.constraint]);
  }
  if (error instanceof multer.MulterError) return (UPLOAD_ERRORS[error.code] ?? (() => ApiError.badRequest()))();
  if (isClientError(error.status)) return new ApiError(error.status, messages.common.badRequest);
  return ApiError.internal();
};

const translateFields = (data, lang) =>
  data?.fields
    ? {
        ...data,
        fields: Object.fromEntries(Object.entries(data.fields).map(([field, key]) => [field, translate(lang, key)])),
      }
    : data;

export const errorHandler = (error, req, res, _next) => {
  const apiError = toApiError(error);
  if (!isClientError(apiError.status)) console.error(error);
  sendError(
    res,
    apiError.status,
    translate(req.lang, apiError.message, apiError.params),
    translateFields(apiError.data, req.lang),
  );
};
