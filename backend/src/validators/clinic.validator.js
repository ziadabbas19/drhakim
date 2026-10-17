import Joi from 'joi';
import { SLOT_DURATION } from '../config/constants.js';
import { bilingual, bilingualKeys, buildResourceSchemas, fields, mediaFields } from './common.js';

const text = (min, max) => Joi.string().trim().min(min).max(max);

export const clinicSchemas = buildResourceSchemas(
  {
    ...bilingual('name', text(2, 100)),
    ...bilingual('city', text(2, 60)),
    ...bilingual('address', text(5, 255)),
    phone: fields.contactPhone,
    mapUrl: fields.url.allow('', null),
    slotDurationMinutes: Joi.number().integer().min(SLOT_DURATION.min).max(SLOT_DURATION.max),
    isActive: fields.isActive,
    sortOrder: fields.sortOrder,
    ...mediaFields('clinic'),
  },
  [...bilingualKeys('name', 'city', 'address'), 'phone', 'slotDurationMinutes'],
);
