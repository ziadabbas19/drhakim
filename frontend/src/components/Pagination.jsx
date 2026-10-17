import { formatNumber } from '../utils/number.js';
import { Button } from './Button.jsx';

export const Pagination = ({ total, limit, offset, onChange }) => {
  if (total <= limit) return null;
  const lastShown = Math.min(offset + limit, total);

  return (
    <nav aria-label="التنقل بين الصفحات" className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
      <span>
        عرض {formatNumber(offset + 1)}–{formatNumber(lastShown)} من {formatNumber(total)}
      </span>
      <div className="flex gap-2">
        <Button size="sm" variant="secondary" disabled={offset === 0} onClick={() => onChange(Math.max(0, offset - limit))}>
          السابق
        </Button>
        <Button size="sm" variant="secondary" disabled={lastShown >= total} onClick={() => onChange(offset + limit)}>
          التالي
        </Button>
      </div>
    </nav>
  );
};
