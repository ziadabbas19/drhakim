import Joi from 'joi';
import { fields } from './fields.js';

export const patientSchema = Joi.object({
  patientName: fields.fullName.required().label('الاسم بالكامل'),
  phone: fields.mobile.required(),
  age: Joi.number().integer().min(0).max(120).empty('').label('السن'),
  notes: Joi.string().trim().max(500).empty('').label('سبب الزيارة'),
});
