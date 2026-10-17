import Joi from 'joi';
import { SLOT_DURATION } from '../config/constants.js';
import { fields, optional, timeRangeRule } from './fields.js';

export const clinicSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().label('اسم العيادة'),
  city: Joi.string().trim().min(2).max(60).required().label('المدينة'),
  address: Joi.string().trim().min(5).max(255).required().label('العنوان'),
  phone: fields.contactPhone.required(),
  mapUrl: optional(fields.url.label('رابط الخريطة')),
  slotDurationMinutes: Joi.number()
    .integer()
    .min(SLOT_DURATION.min)
    .max(SLOT_DURATION.max)
    .required()
    .label('مدة الكشف بالدقائق'),
});

export const scheduleSchema = Joi.object({
  ranges: Joi.array().items(
    Joi.object({
      dayOfWeek: Joi.number().integer().min(0).max(6).required(),
      startTime: fields.time.required().label('وقت البداية'),
      endTime: fields.time.required().label('وقت النهاية'),
    }).custom(timeRangeRule),
  ),
});

export const dayOffSchema = Joi.object({
  date: fields.date.required(),
  reason: Joi.string().required().label('السبب'),
});
