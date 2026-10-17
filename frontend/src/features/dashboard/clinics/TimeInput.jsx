import { CONTROL_CLASS, CONTROL_ERROR_CLASS } from '../../../components/FormField.jsx';
import { cn } from '../../../utils/cn.js';

const FIVE_MINUTES = 300;

export const TimeInput = ({ label, value, onChange, invalid = false }) => (
  <label className="flex items-center gap-2 text-sm font-bold text-ink-muted">
    {label}
    <input
      type="time"
      step={FIVE_MINUTES}
      value={value}
      aria-invalid={invalid}
      onChange={(event) => onChange(event.target.value)}
      className={cn(CONTROL_CLASS, 'w-32 py-2', invalid && CONTROL_ERROR_CLASS)}
    />
  </label>
);
