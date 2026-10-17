import { cn } from '../../utils/cn.js';

export const ChoiceChip = ({ disabled = false, onClick, className, children, ...props }) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onClick}
    className={cn(
      'flex items-center justify-center gap-1 rounded-xl border px-3 py-2.5 text-sm font-bold transition-colors',
      disabled
        ? 'cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400'
        : 'border-slate-200 bg-white text-slate-700 hover:border-brand-400 hover:bg-brand-50 hover:text-brand-800',
      className,
    )}
    {...props}
  >
    {children}
  </button>
);
