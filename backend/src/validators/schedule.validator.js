import Joi from 'joi';
import { fields, timeRangeRule } from './common.js';

const MAX_RANGES_PER_WEEK = 42;

const rangeSchema = Joi.object({
  dayOfWeek: Joi.number().integer().min(0).max(6).required(),
  startTime: fields.time.required(),
  endTime: fields.time.required(),
}).custom(timeRangeRule);

export const scheduleSchema = Joi.object({
  ranges: Joi.array().items(rangeSchema).max(MAX_RANGES_PER_WEEK).required(),
});
