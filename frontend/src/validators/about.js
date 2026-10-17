import Joi from 'joi';
import { OPTION_GROUPS } from '../config/constants.js';
import { ABOUT_ITEM_TYPES } from '../features/about/aboutItemTypes.js';
import { bilingual, mediaFields } from './fields.js';

const text = (max) => Joi.string().trim().max(max);

const SCHEMA_BY_KIND = {
  text: (name, required) => bilingual(name, text(200), { required }),
  textarea: (name, required) => bilingual(name, text(2000), { required }),
  plain: (name, required) => ({ [name]: required ? text(40).required() : text(40).allow('', null) }),
  category: (name) => ({
    [name]: Joi.string()
      .valid(...OPTION_GROUPS.surgeryCategory)
      .allow('', null),
  }),
  gallery: () => mediaFields('aboutItem'),
};

export const aboutItemSchema = (type) =>
  Joi.object(
    Object.assign(
      {},
      ...ABOUT_ITEM_TYPES[type].fields.map(({ name, kind, required = false }) => SCHEMA_BY_KIND[kind](name, required)),
    ),
  );

// The biography is checked for emptiness and sanitised by the API.
export const aboutProfileSchema = Joi.object({
  ...bilingual('headline', text(150)),
  ...bilingual('intro', text(400)),
  ...bilingual('bio', Joi.string().max(20_000)),
  ...mediaFields('site'),
});
