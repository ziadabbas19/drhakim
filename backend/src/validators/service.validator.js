import Joi from 'joi';
import { bilingual, bilingualKeys, buildResourceSchemas, fields, mediaFields } from './common.js';

export const serviceSchemas = buildResourceSchemas(
  {
    ...bilingual('title', Joi.string().trim().min(2).max(100)),
    ...bilingual('description', Joi.string().trim().min(10).max(1000)),
    icon: Joi.string().trim().max(40),
    isFeatured: Joi.boolean(),
    isActive: fields.isActive,
    sortOrder: fields.sortOrder,
    ...mediaFields('service'),
  },
  [...bilingualKeys('title', 'description'), 'icon'],
);
