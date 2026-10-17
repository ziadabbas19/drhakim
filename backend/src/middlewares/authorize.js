import { messages } from '../i18n/index.js';
import { hasPermission } from '../config/permissions.js';
import { ApiError } from '../utils/ApiError.js';

const PASSWORD_CHANGE_REQUIRED = 'PASSWORD_CHANGE_REQUIRED';

export const authorize = (permission) => (req, _res, next) => {
  if (req.user.mustChangePassword) {
    throw ApiError.forbidden(messages.auth.passwordChangeRequired, { code: PASSWORD_CHANGE_REQUIRED });
  }
  if (!hasPermission(req.user.role, permission)) {
    throw ApiError.forbidden();
  }
  next();
};
