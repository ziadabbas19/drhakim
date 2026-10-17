import { CONTROL_CLASS } from '../../../components/FormField.jsx';
import { BOOKING_STATUS_OPTIONS, findOption } from '../../../config/constants.js';
import { cn } from '../../../utils/cn.js';

const TONE_CLASSES = {
  warning: 'border-amber-300 bg-amber-50 text-amber-900',
  brand: 'border-brand-300 bg-brand-50 text-brand-800',
  success: 'border-emerald-300 bg-emerald-50 text-emerald-800',
  danger: 'border-red-300 bg-red-50 text-red-800',
};

export const StatusSelect = ({ value, onChange }) => {
  const { tone } = findOption(BOOKING_STATUS_OPTIONS, value);

  return (
    <select
      aria-label="حالة الحجز"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={cn(CONTROL_CLASS, 'w-auto py-1.5 text-sm font-bold', TONE_CLASSES[tone])}
    >
      {BOOKING_STATUS_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
