import { cn } from '../utils/cn.js';
import { Icon } from './Icon.jsx';

const TONES = {
  info: { box: 'border-brand-200 bg-brand-50 text-brand-900', icon: 'info' },
  success: { box: 'border-emerald-200 bg-emerald-50 text-emerald-900', icon: 'check' },
  warning: { box: 'border-amber-200 bg-amber-50 text-amber-900', icon: 'warning' },
  error: { box: 'border-red-200 bg-red-50 text-red-800', icon: 'error' },
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
