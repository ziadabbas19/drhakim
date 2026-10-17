import { cn } from '../utils/cn.js';

export const DetailList = ({ items, className }) => (
  <dl className={cn('grid gap-3 sm:grid-cols-2', className)}>
    {items.map(({ label, value, ltr }) => (
      <div key={label} className="rounded-xl bg-slate-50 px-4 py-3">
        <dt className="text-xs font-bold text-slate-500">{label}</dt>
        <dd className="mt-1 font-bold text-slate-800">{ltr ? <span dir="ltr">{value}</span> : value}</dd>
      </div>
    ))}
  </dl>
);
