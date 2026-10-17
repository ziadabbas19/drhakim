import { useState } from 'react';
import { Card } from '../../components/Card.jsx';
import { Icon } from '../../components/Icon.jsx';
import { useFormat } from '../../hooks/useFormat.js';
import { useI18n } from '../../hooks/useI18n.js';
import { cn } from '../../utils/cn.js';
import { textDirection } from '../../utils/textDirection.js';
import { Stars } from './Stars.jsx';

const LONG_COMMENT_LENGTH = 220;

// Reviews are shown exactly as written, as text. Each card follows the direction of the language
// the patient wrote in, so its name, city, and comment line up.
export const ReviewCard = ({ review }) => {
  const { t } = useI18n();
  const format = useFormat();
  const [isExpanded, setIsExpanded] = useState(false);
  const isLong = (review.comment?.length ?? 0) > LONG_COMMENT_LENGTH;

  return (
    <Card
      as="figure"
      dir={textDirection(review.comment || review.patientName)}
      className="lift relative flex h-full flex-col gap-4"
    >
      <div className="flex items-center justify-between gap-3">
        <Stars rating={review.rating} />
        <Icon name="quote" className="size-7 text-primary" />
      </div>
      {review.comment && (
        <blockquote className={cn('leading-relaxed text-ink', isLong && !isExpanded && 'line-clamp-5')}>
          {review.comment}
        </blockquote>
      )}
      {isLong && (
        <button
          type="button"
          aria-expanded={isExpanded}
          onClick={() => setIsExpanded((expanded) => !expanded)}
          className="self-start text-sm font-bold text-primary-ink hover:underline"
        >
          {isExpanded ? t('reviews.readLess') : t('reviews.readMore')}
        </button>
      )}
      <figcaption className="mt-auto border-t border-line pt-4 text-sm">
        <p className="font-extrabold text-ink-strong">
          <bdi>{review.patientName}</bdi>
        </p>
        <span className="text-ink-subtle">
          <bdi>{review.city}</bdi> ·{' '}
          <time dir="auto" dateTime={review.createdAt}>
            {format.dateOf(review.createdAt)}
          </time>
        </span>
      </figcaption>
    </Card>
  );
};
