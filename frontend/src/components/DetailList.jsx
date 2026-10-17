import { cn } from '../utils/cn.js';
import { Ltr } from './Ltr.jsx';

export const DetailList = ({ items, className }) => (
  <dl className={cn('grid gap-3 sm:grid-cols-2', className)}>
    {items.map(({ label, value, ltr }) => (
      <div key={label} className="rounded-xl bg-surface-muted px-4 py-3">
        <dt className="text-xs font-bold text-ink-subtle">{label}</dt>
        <dd className="mt-1 font-bold text-ink-strong">{ltr ? <Ltr>{value}</Ltr> : value}</dd>
      </div>
    ))}
  </dl>
);
