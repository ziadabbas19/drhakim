import { ApiError } from '../utils/ApiError.js';
import { idParamSchema } from '../validators/common.js';
import { validationOptions } from '../validators/messages.js';

const toFieldErrors = (details) =>
  details.reduce((fieldErrors, { path, message }) => {
    const key = path.join('.');
    return key in fieldErrors ? fieldErrors : { ...fieldErrors, [key]: message };
  }, {});

export const validate = (schema, source = 'body') => (req, _res, next) => {
  const { value, error } = schema.validate(req[source] ?? {}, validationOptions);

  if (error) {
    throw ApiError.badRequest(error.details[0].message, { fields: toFieldErrors(error.details) });
  }

  // Express 5 exposes req.query through a getter, so the validated value is defined in place.
  Object.defineProperty(req, source, { value, writable: true, enumerable: true, configurable: true });
  next();
};

export const validateIdParam = validate(idParamSchema, 'params');
