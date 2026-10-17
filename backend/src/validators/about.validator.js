import Joi from 'joi';
import { ABOUT_ITEM_TYPES, SURGERY_CATEGORIES } from '../config/constants.js';
import { bilingual, bilingualKeys, bilingualRichText, buildResourceSchemas, fields, mediaFields } from './common.js';

const text = (max) => Joi.string().trim().max(max);

// Building blocks shared by every About list; each receives whether it is required for that list.
const ITEM_FIELDS = {
  title: () => bilingual('title', text(200)),
  subtitle: (required) => bilingual('subtitle', text(200), { required }),
  body: (required) => bilingual('body', text(2000), { required }),
  value: (required) => ({ value: required ? text(40) : text(40).allow('', null) }),
  category: () => ({
    category: Joi.string()
      .valid(...SURGERY_CATEGORIES)
      .allow('', null),
  }),
  gallery: () => mediaFields('aboutItem'),
};

const requiredKey = (name) => (name === 'value' ? name : `${name}Ar`);

// The fields each list uses, and which of them must be filled in.
const ITEM_RULES = {
  [ABOUT_ITEM_TYPES.QUALIFICATION]: { fields: ['title', 'subtitle'], required: ['title', 'subtitle'] },
  [ABOUT_ITEM_TYPES.TIMELINE]: { fields: ['title', 'subtitle', 'body'], required: ['title', 'subtitle'] },
  [ABOUT_ITEM_TYPES.MEMBERSHIP]: { fields: ['title'], required: ['title'] },
  [ABOUT_ITEM_TYPES.STAT]: { fields: ['value', 'title'], required: ['value', 'title'] },
  [ABOUT_ITEM_TYPES.SURGERY]: { fields: ['title', 'body', 'category', 'gallery'], required: ['title'] },
};

const buildItemSchemas = ({ fields: names, required }) =>
  buildResourceSchemas(
    Object.assign({ isActive: fields.isActive }, ...names.map((name) => ITEM_FIELDS[name](required.includes(name)))),
    required.map(requiredKey),
  );

export const aboutItemSchemas = Object.fromEntries(
  Object.entries(ITEM_RULES).map(([type, rules]) => [type, buildItemSchemas(rules)]),
);

export const aboutTypeParamsSchema = Joi.object({
  type: Joi.string()
    .valid(...Object.values(ABOUT_ITEM_TYPES))
    .required(),
});

export const aboutItemParamsSchema = aboutTypeParamsSchema.keys({ id: fields.id.required() });

export const aboutProfileSchema = buildResourceSchemas(
  {
    ...bilingual('headline', text(150)),
    ...bilingual('intro', text(400)),
    ...bilingualRichText('bio'),
    ...mediaFields('site'),
  },
  bilingualKeys('headline', 'intro', 'bio'),
).full;
