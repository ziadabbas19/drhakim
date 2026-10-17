import { messages } from '../i18n/index.js';
import { ApiError } from '../utils/ApiError.js';

export const notFound = (_req, _res, next) => next(ApiError.notFound(messages.common.routeNotFound));
