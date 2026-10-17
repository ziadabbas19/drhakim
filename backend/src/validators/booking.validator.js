import Joi from 'joi';
import { BOOKING_STATUSES } from '../config/constants.js';
import { fields, paginationSchema } from './common.js';

const status = Joi.string()
  .valid(...Object.values(BOOKING_STATUSES))
  .label('حالة الحجز');

export const createBookingSchema = Joi.object({
  clinicId: fields.id.required().label('العيادة'),
  date: fields.date.required(),
  time: fields.time.required().label('الموعد'),
  patientName: fields.fullName.required().label('اسم المريض'),
  phone: fields.mobile.required(),
  age: Joi.number().integer().min(0).max(120).allow(null).label('السن'),
  notes: Joi.string().trim().max(500).allow('', null).label('سبب الزيارة'),
});

export const slotsQuerySchema = Joi.object({
  clinicId: fields.id.required().label('العيادة'),
  date: fields.date.required(),
});

export const bookingListQuerySchema = paginationSchema.keys({
  clinicId: fields.id.label('العيادة'),
  date: fields.date,
  status,
  search: fields.search,
});

export const bookingStatusSchema = Joi.object({
  status: status.required(),
});
