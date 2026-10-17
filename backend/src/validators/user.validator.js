import Joi from 'joi';
import { ROLES } from '../config/permissions.js';
import { fields } from './common.js';

const role = Joi.string()
  .valid(...Object.values(ROLES))
  .label('الصلاحية');

const temporaryPassword = fields.password.required().label('كلمة المرور المؤقتة');

export const createMemberSchema = Joi.object({
  email: fields.email.required(),
  fullName: fields.fullName.required(),
  password: temporaryPassword,
  role: role.default(ROLES.STAFF),
});

export const updateMemberSchema = Joi.object({
  fullName: fields.fullName,
  role,
  isActive: fields.isActive,
}).min(1);

export const resetPasswordSchema = Joi.object({
  password: temporaryPassword,
});
