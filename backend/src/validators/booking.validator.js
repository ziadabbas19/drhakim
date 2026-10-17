import Joi from 'joi';
import { BOOKING_STATUSES } from '../config/constants.js';
import { fields, paginationSchema } from './common.js';

const status = Joi.string().valid(...Object.values(BOOKING_STATUSES));

export const createBookingSchema = Joi.object({
  clinicId: fields.id.required(),
  date: fields.date.required(),
  time: fields.time.required(),
  patientName: fields.fullName.required(),
  phone: fields.mobile.required(),
  age: Joi.number().integer().min(0).max(120).allow(null),
  notes: Joi.string().trim().max(500).allow('', null),
});

export const slotsQuerySchema = Joi.object({
  clinicId: fields.id.required(),
  date: fields.date.required(),
});

export const bookingListQuerySchema = paginationSchema.keys({
  clinicId: fields.id,
  date: fields.date,
  status,
  search: fields.search,
});

export const bookingStatusSchema = Joi.object({
  status: status.required(),
});
