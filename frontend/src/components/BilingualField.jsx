import { useI18n } from '../hooks/useI18n.js';
import { cn } from '../utils/cn.js';
import { FormField } from './FormField.jsx';

// Arabic and English versions of one field, side by side. Each input is written in its own
// direction; English is optional and the site falls back to Arabic when it is empty.
export const BilingualField = ({
  form,
  name,
  label,
  required = false,
  field: Field = FormField,
  hint,
  className,
  ...fieldProps
}) => {
  const { t } = useI18n();

  return (
    <div role="group" aria-label={label} className={cn('grid gap-4 sm:grid-cols-2', className)}>
      <Field
        label={t('bilingual.arabic', { label })}
        lang="ar"
        dir="rtl"
        required={required}
        hint={hint}
        {...fieldProps}
        {...form.register(`${name}Ar`)}
      />
      <Field
        label={t('bilingual.english', { label })}
        lang="en"
        dir="ltr"
        {...fieldProps}
        hint={t('bilingual.fallbackHint')}
        {...form.register(`${name}En`)}
      />
    </div>
  );
};
