import Joi from 'joi';
import { fields } from './fields.js';

export const loginSchema = Joi.object({
  email: fields.email.required(),
  password: fields.existingPassword.required(),
});

export const changePasswordSchema = Joi.object({
  currentPassword: fields.existingPassword.required(),
  newPassword: fields.password
    .required()
    .invalid(Joi.ref('currentPassword'))
    .messages({ 'any.invalid': 'validation.password.reused' }),
  confirmPassword: Joi.any()
    .valid(Joi.ref('newPassword'))
    .required()
    .strip()
    .messages({ 'any.only': 'validation.password.mismatch' }),
});
