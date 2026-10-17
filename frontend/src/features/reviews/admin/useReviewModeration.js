import { dashboardApi } from '../../../api/dashboard.js';
import { useAction } from '../../../hooks/useAction.js';
import { useI18n } from '../../../hooks/useI18n.js';

// Publishing, hiding, featuring, and deleting. The text of a review is never changed.
export const useReviewModeration = (onChanged) => {
  const { t } = useI18n();
  const run = useAction();

  const update = (review, changes) =>
    run(() => dashboardApi.reviews.update(review.id, changes), { onSuccess: onChanged });

  return {
    setStatus: (review, status) => update(review, { status }),

    toggleFeatured: (review) => update(review, { isFeatured: !review.isFeatured }),

    remove: (review) =>
      run(() => dashboardApi.reviews.remove(review.id), {
        confirmation: {
          title: t('dashboard.reviews.remove.title'),
          message: t('dashboard.reviews.remove.message', { name: review.patientName }),
          confirmLabel: t('common.delete'),
        },
        onSuccess: onChanged,
      }),

    // The same update for every selected review, reported once.
    setStatusOf: (reviews, status) =>
      run(
        async () => {
          await Promise.all(reviews.map((review) => dashboardApi.reviews.update(review.id, { status })));
          return { message: t('dashboard.reviews.selection.done', { count: reviews.length }) };
        },
        { onSuccess: onChanged },
      ),
  };
};
