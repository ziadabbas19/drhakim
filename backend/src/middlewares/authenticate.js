import { authService } from '../services/auth.service.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  ACCESS_TOKEN_HEADER,
  isIssuedBefore,
  isPastHalfLife,
  signAccessToken,
  verifyAccessToken,
} from '../utils/token.js';

const BEARER_PREFIX = 'Bearer ';

const readPayload = (authorization = '') => {
  if (!authorization.startsWith(BEARER_PREFIX)) return null;
  try {
    return verifyAccessToken(authorization.slice(BEARER_PREFIX.length));
  } catch {
    return null;
  }
};

export const authenticate = asyncHandler(async (req, res, next) => {
  const payload = readPayload(req.headers.authorization);
  const user = payload && (await authService.findActiveUser(payload.sub));

  // A password change or reset ends every session that started before it.
  if (!user || isIssuedBefore(payload, user.passwordChangedAt)) throw ApiError.unauthorized();

  req.user = user;
  if (isPastHalfLife(payload) || payload.role !== user.role) {
    res.set(ACCESS_TOKEN_HEADER, signAccessToken(user));
  }
  next();
});
