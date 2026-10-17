import Joi from 'joi';
import { MEDIA, PAGINATION, PASSWORD_LENGTH, RICH_TEXT_MAX_LENGTH } from '../config/constants.js';
import { mediaInputKey, mediaSlotsOf } from '../config/mediaSlots.js';
import { isValidDate, toMinutes } from '../utils/date.js';
import { normalizeDigits, normalizePhone } from '../utils/normalize.js';
import { richTextToPlain, sanitizeRichText } from '../utils/richText.js';

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

// Field labels are keys into the `fields` section of src/i18n; most fields are labelled by their own name.
export const fields = {
  id: Joi.string().guid().lowercase(),
  date: Joi.string()
    .pattern(DATE_PATTERN)
    .custom((value, helpers) => (isValidDate(value) ? value : helpers.error('date.invalid'))),
  time: Joi.string().pattern(TIME_PATTERN),
  mobile: phoneField(MOBILE_PATTERN, 'phone.mobile').label('mobile'),
  contactPhone: phoneField(CONTACT_PHONE_PATTERN, 'phone.contact').label('phone'),
  email: Joi.string().trim().lowercase().email().max(255).label('email'),
  password: Joi.string()
    .min(PASSWORD_LENGTH.min)
    .custom((value, helpers) =>
      Buffer.byteLength(value) <= PASSWORD_LENGTH.maxBytes ? value : helpers.error('password.tooLong'),
    ),
  existingPassword: Joi.string().max(PASSWORD_LENGTH.maxBytes),
  fullName: Joi.string().trim().min(3).max(100),
  url: Joi.string()
    .trim()
    .uri({ scheme: ['https'] })
    .max(500),
  isActive: Joi.boolean(),
  sortOrder: Joi.number().integer().min(0),
  search: Joi.string().trim().max(60).custom(normalizeDigits).allow(''),
};

// Arabic and English versions of one field. Arabic is required unless the field itself is
// optional; English is always optional and the API falls back to Arabic when it is empty.
export const bilingual = (name, schema, { required = true } = {}) => ({
  [`${name}Ar`]: required ? schema : schema.allow('', null),
  [`${name}En`]: schema.allow('', null),
});

export const bilingualKeys = (...names) => names.map((name) => `${name}Ar`);

// Sanitised HTML limited to safe formatting. An editor's empty markup such as <p><br></p> counts as empty.
const richText = (required) =>
  Joi.string()
    .max(RICH_TEXT_MAX_LENGTH)
    .custom((value, helpers) => {
      const html = sanitizeRichText(value);
      if (richTextToPlain(html)) return html;
      return required ? helpers.error('any.required') : '';
    });

export const bilingualRichText = (name) => ({
  [`${name}Ar`]: richText(true),
  [`${name}En`]: richText(false).allow('', null),
});

// The image fields an owner accepts (see config/mediaSlots.js): `<slot>Id` or `<slot>Ids`.
export const mediaFields = (ownerType) =>
  Object.fromEntries(
    mediaSlotsOf(ownerType).map(([slot, options]) => [
      mediaInputKey(slot, options),
      options.single ? fields.id.allow(null) : Joi.array().items(fields.id).unique().max(MEDIA.maxGallerySize),
    ]),
  );

export const timeRangeRule = (value, helpers) =>
  toMinutes(value.startTime) < toMinutes(value.endTime) ? value : helpers.error('time.order');

export const idParamSchema = Joi.object({ id: fields.id.required() });

export const paginationSchema = Joi.object({
  limit: Joi.number().integer().min(1).max(PAGINATION.maxLimit).default(PAGINATION.defaultLimit),
  offset: Joi.number().integer().min(0).default(0),
});

export const reorderSchema = Joi.object({
  ids: Joi.array().items(fields.id.required()).min(1).unique().required(),
});

export const buildResourceSchemas = (resourceFields, requiredKeys) => ({
  full: Joi.object(resourceFields).fork(requiredKeys, (field) => field.required()),
  partial: Joi.object(resourceFields).min(1),
});
