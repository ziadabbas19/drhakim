import Joi from 'joi';
import { fields } from './fields.js';

const temporaryPassword = fields.password.required().label('كلمة المرور المؤقتة');

export const updateMemberSchema = Joi.object({
  fullName: fields.fullName.required(),
  role: Joi.string().required().label('الصلاحية'),
});

export const createMemberSchema = updateMemberSchema.keys({
  email: fields.email.required(),
  password: temporaryPassword,
});

export const resetPasswordSchema = Joi.object({ password: temporaryPassword });
