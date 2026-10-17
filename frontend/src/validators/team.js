import Joi from 'joi';
import { fields } from './fields.js';

const temporaryPassword = fields.password.required().label('temporaryPassword');

export const updateMemberSchema = Joi.object({
  fullName: fields.fullName.required(),
  role: Joi.string().required(),
});

export const createMemberSchema = updateMemberSchema.keys({
  email: fields.email.required(),
  password: temporaryPassword,
});

export const resetPasswordSchema = Joi.object({ password: temporaryPassword });
