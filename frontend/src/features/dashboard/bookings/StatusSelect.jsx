import { CONTROL_CLASS } from '../../../components/FormField.jsx';
import { useI18n } from '../../../hooks/useI18n.js';
import { useOptions } from '../../../hooks/useOptions.js';
import { cn } from '../../../utils/cn.js';

const TONE_CLASSES = {
  warning: 'border-warning-line bg-warning-soft text-warning-ink',
  brand: 'border-primary-line bg-primary-faint text-primary-ink',
  success: 'border-success-line bg-success-soft text-success-ink',
  danger: 'border-danger-line bg-danger-soft text-danger-ink',
};

export const StatusSelect = ({ value, onChange }) => {
  const { t } = useI18n();
  const options = useOptions('bookingStatus');
  const { tone } = options.find((option) => option.value === value);

  return (
    <select
      aria-label={t('dashboard.bookings.statusLabel')}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={cn(CONTROL_CLASS, 'w-auto py-1.5 text-sm font-bold', TONE_CLASSES[tone])}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
