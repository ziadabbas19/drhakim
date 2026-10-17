import { Modal } from '../../../components/Modal.jsx';
import { useFormat } from '../../../hooks/useFormat.js';
import { useI18n } from '../../../hooks/useI18n.js';
import { Stars } from '../Stars.jsx';
import { ReviewActions, ReviewStatus } from './ReviewActions.jsx';

// The full review as the patient wrote it; a completed action closes the view.
export const ReviewDetailModal = ({ review, moderation, onClose }) => {
  const { t } = useI18n();
  const format = useFormat();
  const closeAfter =
    (action) =>
    async (...args) => {
      if (await action(...args)) onClose();
    };
  const closingModeration = {
    setStatus: closeAfter(moderation.setStatus),
    toggleFeatured: closeAfter(moderation.toggleFeatured),
    remove: closeAfter(moderation.remove),
  };

  return (
    <Modal
      title={t('dashboard.reviews.detail.title', { name: review.patientName })}
      description={t('dashboard.reviews.detail.submitted', { date: format.dateOf(review.createdAt, 'long') })}
      onClose={onClose}
      footer={<ReviewActions review={review} moderation={closingModeration} />}
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Stars rating={review.rating} size="md" />
          <ReviewStatus review={review} />
        </div>
        <p className="text-sm text-ink-muted">
          <bdi className="font-bold text-ink-strong">{review.patientName}</bdi> · <bdi>{review.city}</bdi>
        </p>
        <blockquote dir="auto" className="rounded-xl bg-surface-muted p-4 leading-relaxed whitespace-pre-wrap text-ink">
          {review.comment || t('dashboard.reviews.noComment')}
        </blockquote>
        {review.reviewedAt && (
          <p className="text-xs text-ink-subtle">
            {t('dashboard.reviews.detail.reviewedBy', {
              name: review.reviewer?.fullName ?? '—',
              date: format.dateOf(review.reviewedAt, 'long'),
            })}
          </p>
        )}
      </div>
    </Modal>
  );
};
