import Joi from 'joi';
import { bilingual, fields } from './common.js';

const optional = (schema) => schema.allow('');

export const settingsSchema = Joi.object({
  doctorPhone: optional(fields.contactPhone.label('doctorPhone')),
  whatsappNumber: optional(fields.mobile.label('whatsappNumber')),
  email: optional(fields.email),
  facebookUrl: optional(fields.url),
  instagramUrl: optional(fields.url),
  youtubeUrl: optional(fields.url),
  tiktokUrl: optional(fields.url),
  ...bilingual('workingHoursNote', Joi.string().trim().max(300), { required: false }),
}).min(1);
