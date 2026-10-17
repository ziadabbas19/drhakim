import Joi from 'joi';
import { env } from '../config/env.js';
import { ROLES } from '../config/permissions.js';
import { User } from '../models/index.js';
import { hashPassword } from '../utils/password.js';
import { fields } from '../validators/common.js';
import { createMissing } from './seedHelpers.js';

const ownerSettingsSchema = Joi.object({
  emails: Joi.array().items(fields.email).min(1),
  initialPassword: fields.password.required(),
});

export const seedOwners = async () => {
  const { emails, initialPassword } = env.owners;
  if (!emails.length) return 'users: OWNER_EMAILS is empty, skipped';

  const { error } = ownerSettingsSchema.validate({ emails, initialPassword });
  if (error) throw new Error(`Check OWNER_EMAILS and OWNER_INITIAL_PASSWORD: ${error.message}`);

  const passwordHash = await hashPassword(initialPassword);
  const owners = emails.map((email) => ({
    email,
    fullName: email.split('@')[0],
    role: ROLES.OWNER,
    passwordHash,
    mustChangePassword: true,
  }));
  const created = await createMissing(User, owners, 'email');

  return `users: ${created} owner accounts created, ${emails.length - created} already existed`;
};
