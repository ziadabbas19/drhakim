import Joi from 'joi';
import { PASSWORD_LENGTH } from '../config/constants.js';
import { normalizePhone } from '../utils/normalize.js';

const MOBILE_PATTERN = /^01[0125]\d{8}$/;
const CONTACT_PHONE_PATTERN = /^0\d{8,10}$/;
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const toMinutes = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const phoneField = (pattern, errorCode) =>
  Joi.string()
    .trim()
    .custom((value, helpers) => {
      const phone = normalizePhone(value);
      return pattern.test(phone) ? phone : helpers.error(errorCode);
    });

export const fields = {
  date: Joi.string().pattern(DATE_PATTERN).label('التاريخ'),
  time: Joi.string().pattern(TIME_PATTERN).label('الوقت'),
  mobile: phoneField(MOBILE_PATTERN, 'phone.mobile').label('رقم الموبايل'),
  contactPhone: phoneField(CONTACT_PHONE_PATTERN, 'phone.contact').label('رقم الهاتف'),
  email: Joi.string().trim().lowercase().email({ tlds: { allow: false } }).max(255).label('البريد الإلكتروني'),
  password: Joi.string()
    .min(PASSWORD_LENGTH.min)
    .custom((value, helpers) =>
      new TextEncoder().encode(value).length <= PASSWORD_LENGTH.maxBytes ? value : helpers.error('password.tooLong'),
    )
    .label('كلمة المرور'),
  existingPassword: Joi.string().max(PASSWORD_LENGTH.maxBytes),
  fullName: Joi.string().trim().min(3).max(100).label('الاسم'),
  url: Joi.string().trim().uri({ scheme: ['https'] }).max(500),
};

export const optional = (schema) => schema.allow('');

export const timeRangeRule = (value, helpers) =>
  toMinutes(value.startTime) < toMinutes(value.endTime) ? value : helpers.error('time.order');
