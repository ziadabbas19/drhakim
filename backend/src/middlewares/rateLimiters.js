import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';
import { messages, translate } from '../i18n/index.js';
import { sendError } from '../utils/response.js';

const MINUTE_MS = 60 * 1000;
const MINUTES_PER_DAY = 24 * 60;

const createRateLimiter = ({ minutes, limit, message, ...options }) =>
  rateLimit({
    windowMs: minutes * MINUTE_MS,
    limit,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    handler: (req, res) => sendError(res, 429, translate(req.lang, message)),
    ...options,
  });

export const apiLimiter = createRateLimiter({
  minutes: 15,
  limit: env.apiRateLimitPer15Min,
  message: messages.rateLimit.general,
});

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

// Counts accepted reviews only; the address is kept in memory for the window and never stored.
export const reviewLimiter = createRateLimiter({
  minutes: MINUTES_PER_DAY,
  limit: env.reviews.rateLimitPerDay,
  message: messages.rateLimit.review,
  skipFailedRequests: true,
});
