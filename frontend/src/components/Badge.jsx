import { cn } from '../utils/cn.js';

const TONES = {
  neutral: 'bg-surface-sunken text-ink-muted',
  brand: 'bg-primary-soft text-primary-ink',
  success: 'bg-success-soft text-success-ink',
  warning: 'bg-warning-soft text-warning-ink',
  danger: 'bg-danger-soft text-danger-ink',
};

export const Badge = ({ tone = 'neutral', className, children }) => (
  <span
    className={cn(
      'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold whitespace-nowrap',
      TONES[tone],
      className,
    )}
  >
    {children}
  </span>
);
