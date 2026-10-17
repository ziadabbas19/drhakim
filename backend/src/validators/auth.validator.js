import Joi from 'joi';
import { fields } from './common.js';
import { joiMessages } from './messages.js';

export const loginSchema = Joi.object({
  email: fields.email.required(),
  password: fields.existingPassword.required().label('كلمة المرور'),
});

export const changePasswordSchema = Joi.object({
  currentPassword: fields.existingPassword.required().label('كلمة المرور الحالية'),
  newPassword: fields.password
    .required()
    .invalid(Joi.ref('currentPassword'))
    .label('كلمة المرور الجديدة')
    .messages({ 'any.invalid': joiMessages['password.reused'] }),
});
