import Joi from 'joi';
import { bilingual, mediaFields } from './fields.js';

export const serviceSchema = Joi.object({
  ...bilingual('title', Joi.string().trim().min(2).max(100)),
  ...bilingual('description', Joi.string().trim().min(10).max(1000)),
  icon: Joi.string().required(),
  isFeatured: Joi.boolean(),
  ...mediaFields('service'),
});
