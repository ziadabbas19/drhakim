import Joi from 'joi';
import { PAGINATION, PASSWORD_LENGTH } from '../config/constants.js';
import { isValidDate, toMinutes } from '../utils/date.js';
import { normalizeDigits, normalizePhone } from '../utils/normalize.js';

const MOBILE_PATTERN = /^01[0125]\d{8}$/;
const CONTACT_PHONE_PATTERN = /^0\d{8,10}$/;
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const phoneField = (pattern, errorCode) =>
  Joi.string()
    .trim()
    .custom((value, helpers) => {
      const phone = normalizePhone(value);
      return pattern.test(phone) ? phone : helpers.error(errorCode);
    });

export const fields = {
  id: Joi.string().guid().lowercase(),
  date: Joi.string()
    .pattern(DATE_PATTERN)
    .custom((value, helpers) => (isValidDate(value) ? value : helpers.error('date.invalid')))
    .label('التاريخ'),
  time: Joi.string().pattern(TIME_PATTERN).label('الوقت'),
  mobile: phoneField(MOBILE_PATTERN, 'phone.mobile').label('رقم الموبايل'),
  contactPhone: phoneField(CONTACT_PHONE_PATTERN, 'phone.contact').label('رقم الهاتف'),
  email: Joi.string().trim().lowercase().email().max(255).label('البريد الإلكتروني'),
  password: Joi.string()
    .min(PASSWORD_LENGTH.min)
    .custom((value, helpers) =>
      Buffer.byteLength(value) <= PASSWORD_LENGTH.maxBytes ? value : helpers.error('password.tooLong'),
    )
    .label('كلمة المرور'),
  existingPassword: Joi.string().max(PASSWORD_LENGTH.maxBytes),
  fullName: Joi.string().trim().min(3).max(100).label('الاسم'),
  url: Joi.string().trim().uri({ scheme: ['https'] }).max(500),
  isActive: Joi.boolean().label('الحالة'),
  sortOrder: Joi.number().integer().min(0).label('الترتيب'),
  search: Joi.string().trim().max(60).custom(normalizeDigits).allow('').label('البحث'),
};

export const timeRangeRule = (value, helpers) =>
  toMinutes(value.startTime) < toMinutes(value.endTime) ? value : helpers.error('time.order');

export const idParamSchema = Joi.object({ id: fields.id.required() });

export const paginationSchema = Joi.object({
  limit: Joi.number().integer().min(1).max(PAGINATION.maxLimit).default(PAGINATION.defaultLimit),
  offset: Joi.number().integer().min(0).default(0),
});

export const reorderSchema = Joi.object({
  ids: Joi.array().items(fields.id.required()).min(1).unique().required().label('الترتيب'),
});

export const buildResourceSchemas = (resourceFields, requiredKeys) => ({
  full: Joi.object(resourceFields).fork(requiredKeys, (field) => field.required()),
  partial: Joi.object(resourceFields).min(1),
});
