import { Button } from '../../components/Button.jsx';
import { Card } from '../../components/Card.jsx';
import { Icon } from '../../components/Icon.jsx';
import { cn } from '../../utils/cn.js';
import { formatNumber } from '../../utils/number.js';

const STATUS_STYLES = {
  done: { card: '', badge: 'bg-emerald-100 text-emerald-700' },
  current: { card: 'border-brand-300 ring-4 ring-brand-500/10', badge: 'bg-brand-600 text-white' },
  upcoming: { card: 'opacity-60', badge: 'bg-slate-100 text-slate-500' },
};

export const WizardStep = ({ number, title, status, summary, onEdit, children }) => (
  <Card
    as="section"
    aria-current={status === 'current' ? 'step' : undefined}
    className={cn('transition-shadow', STATUS_STYLES[status].card)}
  >
    <header className="flex items-center gap-3">
      <span
        className={cn(
          'grid size-9 shrink-0 place-items-center rounded-full text-sm font-extrabold',
          STATUS_STYLES[status].badge,
        )}
      >
        {status === 'done' ? <Icon name="check" className="size-5" /> : formatNumber(number)}
      </span>
      <div className="min-w-0 flex-1">
        <h2 className="font-extrabold text-brand-950">{title}</h2>
        {status === 'done' && <p className="truncate text-sm text-slate-600">{summary}</p>}
      </div>
      {status === 'done' && (
        <Button variant="ghost" size="sm" onClick={onEdit}>
          تغيير
        </Button>
      )}
    </header>
    {status === 'current' && <div className="mt-5 space-y-4">{children}</div>}
  </Card>
);
