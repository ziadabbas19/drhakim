import Joi from 'joi';
import { SLOT_DURATION } from '../config/constants.js';
import { bilingual, fields, mediaFields, optional, timeRangeRule } from './fields.js';

const text = (min, max) => Joi.string().trim().min(min).max(max);

export const clinicSchema = Joi.object({
  ...bilingual('name', text(2, 100)),
  ...bilingual('city', text(2, 60)),
  ...bilingual('address', text(5, 255)),
  phone: fields.contactPhone.required(),
  mapUrl: optional(fields.url),
  slotDurationMinutes: Joi.number().integer().min(SLOT_DURATION.min).max(SLOT_DURATION.max).required(),
  ...mediaFields('clinic'),
});

export const scheduleSchema = Joi.object({
  ranges: Joi.array().items(
    Joi.object({
      dayOfWeek: Joi.number().integer().min(0).max(6).required(),
      startTime: fields.time.required(),
      endTime: fields.time.required(),
    }).custom(timeRangeRule),
  ),
});

export const dayOffSchema = Joi.object({
  date: fields.date.required(),
  reason: Joi.string().required(),
});
