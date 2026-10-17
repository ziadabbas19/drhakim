import { validationOptions } from './messages.js';

export const validate = (schema, values) => {
  const { value, error } = schema.validate(values, validationOptions);
  if (!error) return { value, errors: null };

  const errors = error.details.reduce((fieldErrors, { path, message }) => {
    const key = path.join('.');
    return key in fieldErrors ? fieldErrors : { ...fieldErrors, [key]: message };
  }, {});
  return { value: null, errors };
};
