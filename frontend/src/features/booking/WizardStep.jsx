import { Button } from '../../components/Button.jsx';
import { Card } from '../../components/Card.jsx';
import { Icon } from '../../components/Icon.jsx';
import { useFormat } from '../../hooks/useFormat.js';
import { useI18n } from '../../hooks/useI18n.js';
import { Reveal } from '../../motion/Reveal.jsx';
import { cn } from '../../utils/cn.js';

const STATUS_STYLES = {
  done: { card: '', badge: 'bg-success-soft text-success-ink' },
  current: { card: 'border-primary-line ring-4 ring-primary/10', badge: 'bg-primary text-on-primary' },
  upcoming: { card: 'bg-surface-muted shadow-none', badge: 'bg-surface-sunken text-ink-muted' },
};

export const WizardStep = ({ number, title, status, summary, onEdit, children }) => {
  const { t } = useI18n();
  const format = useFormat();

  return (
    <Card as="section" aria-current={status === 'current' ? 'step' : undefined} className={STATUS_STYLES[status].card}>
      <header className="flex items-center gap-3">
        <span
          className={cn(
            'grid size-9 shrink-0 place-items-center rounded-full text-sm font-extrabold',
            STATUS_STYLES[status].badge,
          )}
        >
          {status === 'done' ? <Icon name="check" className="size-5" /> : format.number(number)}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-extrabold text-ink-strong">{title}</h2>
          {status === 'done' && <p className="truncate text-sm text-ink-muted">{summary}</p>}
        </div>
        {status === 'done' && (
          <Button variant="ghost" size="sm" onClick={onEdit}>
            {t('common.change')}
          </Button>
        )}
      </header>
      {status === 'current' && <Reveal className="mt-5 space-y-4">{children}</Reveal>}
    </Card>
  );
};
