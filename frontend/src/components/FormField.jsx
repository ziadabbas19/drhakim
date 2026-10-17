import { useId } from 'react';
import { cn } from '../utils/cn.js';

export const CONTROL_CLASS =
  'block w-full rounded-xl border border-line-strong bg-surface px-3.5 py-2.5 text-base text-ink placeholder:text-ink-subtle focus:border-primary focus:ring-4 focus:ring-primary/15 focus:outline-none disabled:bg-surface-sunken disabled:text-ink-subtle';

export const CONTROL_ERROR_CLASS = 'border-danger focus:border-danger focus:ring-danger/15';

// Label, control, and hint or error message. `children` renders the control with the ids it needs.
export const FieldShell = ({ label, error, hint, required, className, children }) => {
  const id = useId();
  const message = error || hint;
  const messageId = message ? `${id}-message` : undefined;

  return (
    <div className={cn('space-y-1.5', className)}>
      <label id={`${id}-label`} htmlFor={id} className="block text-sm font-bold text-ink">
        {label}
        {required && (
          <span className="text-danger-ink" aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </label>
      {children({ id, labelId: `${id}-label`, messageId, invalid: Boolean(error) })}
      {message && (
        <p id={messageId} className={cn('text-sm', error ? 'font-semibold text-danger-ink' : 'text-ink-subtle')}>
          {message}
        </p>
      )}
    </div>
  );
};

export const FormField = ({
  label,
  error,
  hint,
  as: Control = 'input',
  options,
  required,
  className,
  ...controlProps
}) => (
  <FieldShell label={label} error={error} hint={hint} required={required} className={className}>
    {({ id, messageId, invalid }) => (
      <Control
        id={id}
        aria-invalid={invalid}
        aria-required={required || undefined}
        aria-describedby={messageId}
        className={cn(CONTROL_CLASS, Control === 'textarea' && 'min-h-24 resize-y', invalid && CONTROL_ERROR_CLASS)}
        {...controlProps}
      >
        {options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Control>
    )}
  </FieldShell>
);

export const CheckboxField = ({ label, description, name, value, onChange }) => (
  <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-line p-3 hover:bg-surface-muted">
    <input
      type="checkbox"
      name={name}
      checked={Boolean(value)}
      onChange={onChange}
      className="mt-1 size-4 shrink-0 accent-primary"
    />
    <span className="space-y-0.5">
      <span className="block text-sm font-bold text-ink">{label}</span>
      {description && <span className="block text-xs text-ink-subtle">{description}</span>}
    </span>
  </label>
);
