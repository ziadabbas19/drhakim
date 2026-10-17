import { useState } from 'react';
import { dashboardApi } from '../../../api/dashboard.js';
import { Alert } from '../../../components/Alert.jsx';
import { Button } from '../../../components/Button.jsx';
import { FormField } from '../../../components/FormField.jsx';
import { SearchField } from '../../../components/SearchField.jsx';
import { REVIEW_STATUS } from '../../../config/constants.js';
import { useFormat } from '../../../hooks/useFormat.js';
import { useI18n } from '../../../hooks/useI18n.js';
import { useOptions } from '../../../hooks/useOptions.js';
import { usePaginatedList } from '../../../hooks/usePaginatedList.js';
import { useReviewCounts } from '../../../hooks/useReviewCounts.js';
import { FilterBar, bindFilter, withAllOption } from '../../dashboard/FilterBar.jsx';
import { PaginatedTable } from '../../dashboard/PaginatedTable.jsx';
import { PanelHeader } from '../../dashboard/PanelHeader.jsx';
import { selectionColumn, useSelection } from '../../dashboard/useSelection.jsx';
import { RATINGS, Stars } from '../Stars.jsx';
import { ReviewActions, ReviewStatus } from './ReviewActions.jsx';
import { ReviewDetailModal } from './ReviewDetailModal.jsx';
import { useReviewModeration } from './useReviewModeration.js';

const ReviewFilters = ({ filters, onChange }) => {
  const { t } = useI18n();
  const { counts } = useReviewCounts();
  const bind = bindFilter(filters, onChange);
  const statusOptions = useOptions('reviewStatus').map((option) => ({
    ...option,
    label: counts ? `${option.label} (${counts[option.value]})` : option.label,
  }));
  const ratingOptions = RATINGS.toReversed().map((rating) => ({
    value: String(rating),
    label: t('reviews.stars', { count: rating }),
  }));

  return (
    <FilterBar>
      <SearchField
        label={t('dashboard.reviews.filters.search')}
        placeholder={t('dashboard.reviews.filters.searchPlaceholder')}
        name="search"
        value={filters.search ?? ''}
        onChange={onChange}
      />
      <FormField
        label={t('dashboard.reviews.filters.status')}
        as="select"
        options={withAllOption(t('dashboard.reviews.filters.allStatuses'), statusOptions)}
        {...bind('status')}
      />
      <FormField
        label={t('dashboard.reviews.filters.rating')}
        as="select"
        options={withAllOption(t('dashboard.reviews.filters.allRatings'), ratingOptions)}
        {...bind('rating')}
      />
    </FilterBar>
  );
};

// Pending reviews come first. Selected rows can be published or rejected together.
export const ReviewsPanel = () => {
  const { t } = useI18n();
  const format = useFormat();
  const counts = useReviewCounts();
  const reviews = usePaginatedList(dashboardApi.reviews.list);
  const selection = useSelection(reviews.items);
  const [viewed, setViewed] = useState(null);

  const refresh = () => {
    reviews.reload();
    counts.reload();
    selection.clear();
  };
  const moderation = useReviewModeration(refresh);

  const columns = [
    selectionColumn(selection, {
      selectAllLabel: t('dashboard.reviews.selection.selectAll'),
      rowLabel: (review) => t('dashboard.reviews.selection.selectRow', { name: review.patientName }),
    }),
    {
      key: 'patient',
      header: t('dashboard.reviews.columns.patient'),
      render: (review) => (
        <div className="min-w-28">
          <p className="font-bold text-ink-strong">
            <bdi>{review.patientName}</bdi>
          </p>
          <bdi className="text-xs text-ink-subtle">{review.city}</bdi>
        </div>
      ),
    },
    {
      key: 'rating',
      header: t('dashboard.reviews.columns.rating'),
      render: (review) => <Stars rating={review.rating} />,
    },
    {
      key: 'comment',
      header: t('dashboard.reviews.columns.comment'),
      // Takes only the width left over by the other columns; the full text is in the detail view.
      className: 'w-full max-w-0',
      render: (review) => (
        <p dir="auto" className="truncate text-ink-muted" title={review.comment ?? undefined}>
          {review.comment || t('dashboard.reviews.noComment')}
        </p>
      ),
    },
    {
      key: 'status',
      header: t('dashboard.reviews.columns.status'),
      render: (review) => <ReviewStatus review={review} />,
    },
    {
      key: 'date',
      header: t('dashboard.reviews.columns.date'),
      render: (review) => <span className="whitespace-nowrap">{format.dateOf(review.createdAt, 'short')}</span>,
    },
    {
      key: 'actions',
      header: '',
      render: (review) => <ReviewActions review={review} moderation={moderation} onView={setViewed} compact />,
    },
  ];

  return (
    <>
      <PanelHeader title={t('dashboard.reviews.title')} description={t('dashboard.reviews.description')} />
      <Alert className="mb-5">{t('dashboard.reviews.hint')}</Alert>
      <ReviewFilters filters={reviews.filters} onChange={reviews.setFilter} />
      {selection.selected.length > 0 && (
        <div className="pop-in mb-4 flex flex-wrap items-center gap-2 rounded-2xl border border-primary-line bg-primary-faint p-3">
          <p className="me-auto text-sm font-bold text-ink-strong" aria-live="polite">
            {t('dashboard.reviews.selection.count', { count: selection.selected.length })}
          </p>
          <Button
            size="sm"
            icon="check"
            onClick={() => moderation.setStatusOf(selection.selected, REVIEW_STATUS.APPROVED)}
          >
            {t('dashboard.reviews.selection.approve')}
          </Button>
          <Button
            size="sm"
            variant="secondary"
            icon="close"
            onClick={() => moderation.setStatusOf(selection.selected, REVIEW_STATUS.REJECTED)}
          >
            {t('dashboard.reviews.selection.reject')}
          </Button>
        </div>
      )}
      <PaginatedTable list={reviews} columns={columns} emptyMessage={t('dashboard.reviews.empty')} />
      {viewed && <ReviewDetailModal review={viewed} moderation={moderation} onClose={() => setViewed(null)} />}
    </>
  );
};
