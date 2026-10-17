const VALIDATION_OPTIONS = Object.freeze({ abortEarly: false, stripUnknown: true, errors: { wrap: { label: false } } });

// t() returns the key itself when there is no translation.
const translated = (t, key, params) => (key && t(key) !== key ? t(key, params) : null);

// Labels are keys into `fields` in the translation files: an explicit .label() first, then the
// field names along the path.
const fieldLabel = (t, { context = {}, path }) =>
  [context.label, ...path.toReversed().filter((part) => typeof part === 'string')]
    .map((name) => translated(t, `fields.${name}`))
    .find(Boolean) ?? context.label;

// A schema may override a rule's message with a translation key through .messages().
const toMessage = (t, detail) => {
  const params = { ...detail.context, label: fieldLabel(t, detail) };
  return (
    [detail.message, `validation.${detail.type}`].map((key) => translated(t, key, params)).find(Boolean) ??
    t('validation.default', params)
  );
};

export const validate = (schema, values, t) => {
  const { value, error } = schema.validate(values, VALIDATION_OPTIONS);
  if (!error) return { value, errors: null };

  const errors = error.details.reduce((fieldErrors, detail) => {
    const key = detail.path.join('.');
    return key in fieldErrors ? fieldErrors : { ...fieldErrors, [key]: toMessage(t, detail) };
  }, {});
  return { value: null, errors };
};
