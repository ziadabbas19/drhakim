import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';
import { messages } from '../config/messages.js';
import { sendError } from '../utils/response.js';

const MINUTE_MS = 60 * 1000;

const createRateLimiter = ({ minutes, limit, message, ...options }) =>
  rateLimit({
    windowMs: minutes * MINUTE_MS,
    limit,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    handler: (_req, res) => sendError(res, 429, message),
    ...options,
  });

export const apiLimiter = createRateLimiter({ minutes: 15, limit: 600, message: messages.rateLimit.general });

export const loginLimiter = createRateLimiter({
  minutes: 15,
  limit: 10,
  message: messages.rateLimit.login,
  skipSuccessfulRequests: true,
});

export const bookingLimiter = createRateLimiter({
  minutes: 60,
  limit: env.bookingRateLimitPerHour,
  message: messages.rateLimit.booking,
  skipFailedRequests: true,
});
