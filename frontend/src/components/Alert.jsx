import { cn } from '../utils/cn.js';
import { Icon } from './Icon.jsx';

const TONES = {
  info: { box: 'border-primary-line bg-primary-faint text-ink-strong', icon: 'info' },
  success: { box: 'border-success-line bg-success-soft text-success-ink', icon: 'check' },
  warning: { box: 'border-warning-line bg-warning-soft text-warning-ink', icon: 'warning' },
  error: { box: 'border-danger-line bg-danger-soft text-danger-ink', icon: 'error' },
};

export const Alert = ({ tone = 'info', title, action, className, children }) => (
  <div
    role={tone === 'error' ? 'alert' : 'status'}
    className={cn('flex items-start gap-3 rounded-xl border p-4 text-sm leading-relaxed', TONES[tone].box, className)}
  >
    <Icon name={TONES[tone].icon} className="mt-0.5 size-5 shrink-0" />
    <div className="min-w-0 flex-1 space-y-1">
      {title && <p className="font-bold">{title}</p>}
      {children}
    </div>
    {action}
  </div>
);
