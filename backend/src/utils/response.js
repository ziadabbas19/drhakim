import { messages, translate } from '../i18n/index.js';
import { asyncHandler } from './asyncHandler.js';

export const RESPONSES = Object.freeze({
  created: { status: 201, message: messages.common.created },
  saved: { message: messages.common.saved },
  deleted: { message: messages.common.deleted },
});

export const sendSuccess = (res, data = null, { status = 200, message = null } = {}) =>
  res.status(status).json({ success: true, data: data ?? null, message });

export const sendError = (res, status, message, data = null) =>
  res.status(status).json({ success: false, data, message });

export const respond = (resolveData, { status, message } = {}) =>
  asyncHandler(async (req, res) =>
    sendSuccess(res, await resolveData(req), { status, message: message ? translate(req.lang, message) : null }),
  );
