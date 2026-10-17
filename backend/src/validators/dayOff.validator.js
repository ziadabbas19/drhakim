import Joi from 'joi';
import { DAY_OFF_REASONS } from '../config/constants.js';
import { fields } from './common.js';

export const dayOffSchema = Joi.object({
  date: fields.date.required(),
  reason: Joi.string()
    .valid(...DAY_OFF_REASONS)
    .required(),
});

export const dayOffParamsSchema = Joi.object({
  id: fields.id.required(),
  dayOffId: fields.id.required(),
});
