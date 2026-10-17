import { useId } from 'react';
import { cn } from '../utils/cn.js';

export const CONTROL_CLASS =
  'block w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-base text-slate-900 transition-colors placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 focus:outline-none disabled:bg-slate-100 disabled:text-slate-500';

const ERROR_CLASS = 'border-red-400 focus:border-red-500 focus:ring-red-500/15';

export const FormField = ({ label, error, hint, as: Control = 'input', options, required, className, ...controlProps }) => {
  const id = useId();
  const messageId = `${id}-message`;
  const message = error || hint;

  return (
    <div className={cn('space-y-1.5', className)}>
      <label htmlFor={id} className="block text-sm font-bold text-slate-700">
        {label}
        {required && (
          <span className="text-red-600" aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </label>
      <Control
        id={id}
        aria-invalid={Boolean(error)}
        aria-required={required || undefined}
        aria-describedby={message ? messageId : undefined}
        className={cn(CONTROL_CLASS, Control === 'textarea' && 'min-h-24 resize-y', error && ERROR_CLASS)}
        {...controlProps}
      >
        {options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Control>
      {message && (
        <p id={messageId} className={cn('text-sm', error ? 'font-semibold text-red-600' : 'text-slate-500')}>
          {message}
        </p>
      )}
    </div>
  );
};

export const CheckboxField = ({ label, description, name, value, onChange }) => (
  <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-3 transition-colors hover:bg-slate-50">
    <input
      type="checkbox"
      name={name}
      checked={Boolean(value)}
      onChange={onChange}
      className="mt-1 size-4 shrink-0 accent-brand-600"
    />
    <span className="space-y-0.5">
      <span className="block text-sm font-bold text-slate-700">{label}</span>
      {description && <span className="block text-xs text-slate-500">{description}</span>}
    </span>
  </label>
);
