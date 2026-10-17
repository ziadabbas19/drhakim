import Joi from 'joi';
import { PASSWORD_LENGTH } from '../config/constants.js';
import { MEDIA_OWNERS } from '../config/mediaSlots.js';
import { normalizePhone } from '../utils/normalize.js';

const MOBILE_PATTERN = /^01[0125]\d{8}$/;
const CONTACT_PHONE_PATTERN = /^0\d{8,10}$/;
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const MAX_GALLERY_SIZE = 30;

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

// Labels are keys into `fields` in src/i18n; most fields are labelled by their own name.
export const fields = {
  date: Joi.string().pattern(DATE_PATTERN),
  time: Joi.string().pattern(TIME_PATTERN),
  mobile: phoneField(MOBILE_PATTERN, 'phone.mobile').label('mobile'),
  contactPhone: phoneField(CONTACT_PHONE_PATTERN, 'phone.contact').label('phone'),
  email: Joi.string()
    .trim()
    .lowercase()
    .email({ tlds: { allow: false } })
    .max(255)
    .label('email'),
  password: Joi.string()
    .min(PASSWORD_LENGTH.min)
    .custom((value, helpers) =>
      new TextEncoder().encode(value).length <= PASSWORD_LENGTH.maxBytes ? value : helpers.error('password.tooLong'),
    ),
  existingPassword: Joi.string().max(PASSWORD_LENGTH.maxBytes),
  fullName: Joi.string().trim().min(3).max(100),
  url: Joi.string()
    .trim()
    .uri({ scheme: ['https'] })
    .max(500),
};

export const optional = (schema) => schema.allow('');

// Arabic is required unless the field itself is optional; English is optional and the site shows
// the Arabic text when it is left empty. Mirrors the API rules.
export const bilingual = (name, schema, { required = true } = {}) => ({
  [`${name}Ar`]: required ? schema.required() : schema.allow('', null),
  [`${name}En`]: schema.allow('', null),
});

// Forms hold the chosen image objects; they are sent as ids (see config/mediaSlots.js).
const mediaObject = Joi.object({ id: Joi.string().required() }).unknown();

export const mediaFields = (ownerType) =>
  Object.fromEntries(
    Object.entries(MEDIA_OWNERS[ownerType]).map(([slot, { single }]) => [
      slot,
      single ? mediaObject.allow(null) : Joi.array().items(mediaObject).max(MAX_GALLERY_SIZE),
    ]),
  );

export const timeRangeRule = (value, helpers) =>
  toMinutes(value.startTime) < toMinutes(value.endTime) ? value : helpers.error('time.order');
