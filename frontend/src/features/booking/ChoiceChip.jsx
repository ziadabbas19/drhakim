import { cn } from '../../utils/cn.js';

export const ChoiceChip = ({ disabled = false, onClick, className, children, ...props }) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onClick}
    className={cn(
      'press flex w-full items-center justify-center gap-1 rounded-xl border px-3 py-2.5 text-sm font-bold',
      disabled
        ? 'cursor-not-allowed border-line bg-surface-muted text-ink-subtle'
        : 'border-line bg-surface text-ink hover:border-primary hover:bg-primary-faint hover:text-primary-ink',
      className,
    )}
    {...props}
  >
    {children}
  </button>
);
