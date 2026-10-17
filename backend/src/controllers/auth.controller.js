import { messages } from '../config/messages.js';
import { authService, toSessionUser } from '../services/auth.service.js';
import { respond } from '../utils/response.js';

export const authController = {
  login: respond((req) => authService.login(req.body)),
  me: respond((req) => toSessionUser(req.user)),
  changePassword: respond((req) => authService.changePassword(req.user, req.body), {
    message: messages.auth.passwordChanged,
  }),
};
