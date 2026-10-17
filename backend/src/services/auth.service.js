import { randomUUID } from 'node:crypto';
import { messages } from '../i18n/index.js';
import { getPermissions } from '../config/permissions.js';
import { User } from '../models/index.js';
import { ApiError } from '../utils/ApiError.js';
import { hashPassword, verifyPassword } from '../utils/password.js';
import { signAccessToken } from '../utils/token.js';

let dummyHashPromise;

// Comparing against a throwaway hash keeps response time the same whether or not the email exists.
const getDummyHash = () => (dummyHashPromise ??= hashPassword(randomUUID()));

export const toSessionUser = (user) => ({ ...user.toJSON(), permissions: getPermissions(user.role) });

const startSession = (user) => ({ token: signAccessToken(user), user: toSessionUser(user) });

export const authService = {
  findActiveUser: (id) => User.findOne({ where: { id, isActive: true } }),

  async login({ email, password }) {
    const user = await User.findOne({ where: { email } });
    const passwordMatches = await verifyPassword(password, user?.passwordHash ?? (await getDummyHash()));

    if (!user?.isActive || !passwordMatches) {
      throw ApiError.unauthorized(messages.auth.invalidCredentials);
    }
    return startSession(user);
  },

  async changePassword(user, { currentPassword, newPassword }) {
    if (!(await verifyPassword(currentPassword, user.passwordHash))) {
      throw ApiError.badRequest(messages.auth.wrongCurrentPassword, {
        fields: { currentPassword: messages.auth.wrongCurrentPassword },
      });
    }
    await user.update({
      passwordHash: await hashPassword(newPassword),
      mustChangePassword: false,
      passwordChangedAt: new Date(),
    });
    return startSession(user);
  },
};
