import Joi from 'joi';
import { DEFAULT_LANGUAGE, LANGUAGES } from '../config/constants.js';
import { localize } from '../utils/localize.js';

const languageSchema = Joi.string()
  .trim()
  .lowercase()
  .valid(...LANGUAGES);

// ?lang=ar|en wins, then the Accept-Language header; anything else falls back to Arabic.
export const resolveLanguage = (req, res, next) => {
  const { value, error } = languageSchema.validate(req.query.lang);
  req.lang = (!error && value) || req.acceptsLanguages(...LANGUAGES) || DEFAULT_LANGUAGE;
  res.vary('Accept-Language');
  res.set('Content-Language', req.lang);
  next();
};

// Public responses carry one language: paired fields (nameAr/nameEn) become a single `name`.
export const localizeResponses = (req, res, next) => {
  const sendJson = res.json.bind(res);
  res.json = (body) => sendJson(body?.data ? { ...body, data: localize(body.data, req.lang) } : body);
  next();
};
