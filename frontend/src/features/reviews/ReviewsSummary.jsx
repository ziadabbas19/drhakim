import { useEffect } from 'react';
import { REVIEW_LIMITS } from '../../config/constants.js';
import { useContent } from '../../hooks/useContent.js';
import { useI18n } from '../../hooks/useI18n.js';
import { setStructuredData } from '../../utils/documentMeta.js';
import { Stars } from './Stars.jsx';

const SITE_URL = (import.meta.env.VITE_SITE_URL || window.location.origin).replace(/\/$/, '');

const ratingRange = { bestRating: REVIEW_LIMITS.maxRating, worstRating: 1 };

// Shown only when at least one review has been approved.
export const ReviewsSummary = ({ summary }) => {
  const { t } = useI18n();
  if (!summary?.count) return null;
  const average = summary.average.toFixed(1);

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center">
      <span dir="ltr" className="text-4xl font-extrabold text-ink-strong">
        {average}
      </span>
      <Stars rating={summary.average} size="md" decorative />
      <span className="text-sm font-semibold text-ink-muted">
        {t('reviews.average', { average })} · {t('reviews.basedOn', { count: summary.count })}
      </span>
    </div>
  );
};

// Review and AggregateRating structured data, built from real approved reviews only.
export const useReviewsStructuredData = (summary, reviews) => {
  const { doctor } = useContent();

  useEffect(() => {
    if (!summary?.count || !reviews?.length) return undefined;
    return setStructuredData('reviews', {
      '@context': 'https://schema.org',
      '@type': 'Physician',
      name: doctor.name,
      url: SITE_URL,
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: summary.average,
        reviewCount: summary.count,
        ...ratingRange,
      },
      review: reviews.map((review) => ({
        '@type': 'Review',
        author: { '@type': 'Person', name: review.patientName },
        datePublished: review.createdAt.slice(0, 10),
        reviewRating: { '@type': 'Rating', ratingValue: review.rating, ...ratingRange },
        ...(review.comment && { reviewBody: review.comment }),
      })),
    });
  }, [summary, reviews, doctor.name]);
};
