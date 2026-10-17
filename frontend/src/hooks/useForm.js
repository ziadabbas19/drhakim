import { useState } from 'react';
import { validate } from '../validators/validate.js';

const readFieldValue = ({ target }) => (target.type === 'checkbox' ? target.checked : target.value);

const withoutFieldErrors = (errors, name) =>
  Object.fromEntries(Object.entries(errors).filter(([key]) => key !== name && !key.startsWith(`${name}.`)));

const focusFirstInvalidField = (form) =>
  requestAnimationFrame(() => form?.querySelector('[aria-invalid="true"]')?.focus());

export const useForm = ({ initialValues, schema, onSubmit }) => {
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
    onChange: (event) => setValue(name, readFieldValue(event)),
  });

  const handleSubmit = async (event) => {
    event?.preventDefault();
    const form = event?.currentTarget;
    const result = validate(schema, values);

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
