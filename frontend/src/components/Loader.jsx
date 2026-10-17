import { cn } from '../utils/cn.js';
import { Icon } from './Icon.jsx';

export const Loader = ({ fullPage = false }) => (
  <div
    role="status"
    className={cn('flex items-center justify-center gap-3 text-slate-500', fullPage ? 'min-h-[60dvh]' : 'py-10')}
  >
    <Icon name="loader" className="size-6 animate-spin text-brand-600" />
    <span className="text-sm font-semibold">جارٍ التحميل...</span>
  </div>
);
