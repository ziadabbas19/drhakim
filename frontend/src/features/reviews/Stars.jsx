import { Icon } from '../../components/Icon.jsx';
import { REVIEW_LIMITS } from '../../config/constants.js';
import { useI18n } from '../../hooks/useI18n.js';
import { cn } from '../../utils/cn.js';

export const RATINGS = Object.freeze(Array.from({ length: REVIEW_LIMITS.maxRating }, (_, index) => index + 1));

export const starClass = (isFilled) => (isFilled ? 'fill-current text-warning' : 'text-line-strong');

const SIZES = { sm: 'size-4.5', md: 'size-6' };

// How much of the star numbered `value` is filled (0 to 1), so an average such as 4.5 shows half a star.
const fillOf = (rating, value) => Math.min(Math.max(rating - value + 1, 0), 1);

// A partly filled star is an outline with a filled copy clipped from the reading start.
const Star = ({ fill, className }) => (
  <span className="relative inline-flex">
    <Icon name="star" className={cn(className, starClass(fill === 1))} />
    {fill > 0 && fill < 1 && (
      <span className="absolute inset-y-0 start-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
        <Icon name="star" className={cn(className, 'max-w-none', starClass(true))} />
      </span>
    )}
  </span>
);

// A rating out of five. `decorative` when the number is already written next to it.
export const Stars = ({ rating, size = 'sm', decorative = false }) => {
  const { t } = useI18n();

  return (
    <span
      role={decorative ? undefined : 'img'}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : t('reviews.ratedOutOf', { rating })}
      className="inline-flex gap-0.5"
    >
      {RATINGS.map((value) => (
        <Star key={value} fill={fillOf(rating, value)} className={SIZES[size]} />
      ))}
    </span>
  );
};
