import { useState } from 'react';
import { validate } from '../validators/validate.js';
import { useI18n } from './useI18n.js';

// Inputs pass change events; custom controls (rich text, image picker) pass the value itself.
const readFieldValue = (change) => {
  const target = change?.target;
  if (!target) return change;
  return target.type === 'checkbox' ? target.checked : target.value;
};

const withoutFieldErrors = (errors, name) =>
  Object.fromEntries(Object.entries(errors).filter(([key]) => key !== name && !key.startsWith(`${name}.`)));

const focusFirstInvalidField = (form) =>
  requestAnimationFrame(() => form?.querySelector('[aria-invalid="true"]')?.focus());

export const useForm = ({ initialValues, schema, onSubmit }) => {
  const { t } = useI18n();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setValue = (name, value) => {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => withoutFieldErrors(current, name));
  };

  const register = (name) => ({
    name,
    value: values[name] ?? '',
    error: errors[name],
    onChange: (change) => setValue(name, readFieldValue(change)),
  });

  const handleSubmit = async (event) => {
    event?.preventDefault();
    const form = event?.currentTarget;
    const result = validate(schema, values, t);

    setSubmitError('');
    setErrors(result.errors ?? {});
    if (result.errors) {
      focusFirstInvalidField(form);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(result.value);
    } catch (error) {
      setErrors(error.fields ?? {});
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = (nextValues = initialValues) => {
    setValues(nextValues);
    setErrors({});
    setSubmitError('');
  };

  return { values, errors, submitError, isSubmitting, setValue, register, handleSubmit, reset };
};
