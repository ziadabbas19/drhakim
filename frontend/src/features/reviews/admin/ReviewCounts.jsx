import { useMemo } from 'react';
import { dashboardApi } from '../../../api/dashboard.js';
import { useFetch } from '../../../hooks/useFetch.js';
import { useFormat } from '../../../hooks/useFormat.js';
import { useI18n } from '../../../hooks/useI18n.js';
import { ReviewCountsContext, useReviewCounts } from '../../../hooks/useReviewCounts.js';

const NO_COUNTS = Promise.resolve({ data: null });

// Review counts per status, shared by the menu badge and the reviews panel, which reloads them
// after every moderation action.
export const ReviewCountsProvider = ({ enabled, children }) => {
  const { data, reload } = useFetch(() => (enabled ? dashboardApi.reviews.counts() : NO_COUNTS), [enabled]);
  const value = useMemo(() => ({ counts: data, reload }), [data, reload]);
  return <ReviewCountsContext value={value}>{children}</ReviewCountsContext>;
};

export const PendingReviewsBadge = () => {
  const { t } = useI18n();
  const format = useFormat();
  const { counts } = useReviewCounts();
  if (!counts?.pending) return null;

  return (
    <span className="ms-auto rounded-full bg-warning-soft px-2 py-0.5 text-xs font-extrabold text-warning-ink">
      <span aria-hidden="true">{format.number(counts.pending)}</span>
      <span className="sr-only">{t('dashboard.reviews.pending', { count: counts.pending })}</span>
    </span>
  );
};
