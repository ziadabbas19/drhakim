import { hasTranslation, translate } from '../i18n/index.js';
import { ApiError } from '../utils/ApiError.js';
import { idParamSchema } from '../validators/common.js';

const VALIDATION_OPTIONS = Object.freeze({ abortEarly: false, stripUnknown: true, errors: { wrap: { label: false } } });

// Labels come from the field dictionary: an explicit .label() key first, then the field names on the path.
const fieldLabel = (lang, { context = {}, path }) => {
  const candidates = [context.label, ...path.toReversed().filter((part) => typeof part === 'string')];
  const known = candidates.find((name) => name && hasTranslation(lang, `fields.${name}`));
  return known ? translate(lang, `fields.${known}`) : context.label;
};

// A schema may override a rule's message with a translation key through .messages().
const toMessage = (lang, detail) => {
  const key =
    [detail.message, `validation.${detail.type}`].find((candidate) => hasTranslation(lang, candidate)) ??
    'validation.default';
  return translate(lang, key, { ...detail.context, label: fieldLabel(lang, detail) });
};

const toFieldErrors = (details, lang) =>
  details.reduce((fieldErrors, detail) => {
    const key = detail.path.join('.');
    return key in fieldErrors ? fieldErrors : { ...fieldErrors, [key]: toMessage(lang, detail) };
  }, {});

// `schema` may be a function of the request, for routes whose rules depend on a URL parameter.
export const validate =
  (schema, source = 'body') =>
  (req, _res, next) => {
    const resolvedSchema = typeof schema === 'function' ? schema(req) : schema;
    const { value, error } = resolvedSchema.validate(req[source] ?? {}, VALIDATION_OPTIONS);

    if (error) {
      const fields = toFieldErrors(error.details, req.lang);
      throw ApiError.badRequest(Object.values(fields)[0], { fields });
    }

    // Express 5 exposes req.query through a getter, so the validated value is defined in place.
    Object.defineProperty(req, source, { value, writable: true, enumerable: true, configurable: true });
    next();
  };

export const validateIdParam = validate(idParamSchema, 'params');
