import Joi from 'joi';
import { fields } from './fields.js';

export const patientSchema = Joi.object({
  patientName: fields.fullName.required(),
  phone: fields.mobile.required(),
  age: Joi.number().integer().min(0).max(120).empty(''),
  notes: Joi.string().trim().max(500).empty(''),
});
