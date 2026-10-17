import { useI18n } from '../hooks/useI18n.js';
import { Button } from './Button.jsx';

export const Pagination = ({ total, limit, offset, onChange }) => {
  const { t } = useI18n();
  if (total <= limit) return null;
  const lastShown = Math.min(offset + limit, total);

  return (
    <nav
      aria-label={t('a11y.pagination')}
      className="flex flex-wrap items-center justify-between gap-3 text-sm text-ink-muted"
    >
      <span>{t('pagination.summary', { from: offset + 1, to: lastShown, total })}</span>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="secondary"
          disabled={offset === 0}
          onClick={() => onChange(Math.max(0, offset - limit))}
        >
          {t('common.previous')}
        </Button>
        <Button size="sm" variant="secondary" disabled={lastShown >= total} onClick={() => onChange(offset + limit)}>
          {t('common.next')}
        </Button>
      </div>
    </nav>
  );
};
