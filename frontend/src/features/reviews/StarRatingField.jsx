import { useState } from 'react';
import { FieldShell } from '../../components/FormField.jsx';
import { Icon } from '../../components/Icon.jsx';
import { useI18n } from '../../hooks/useI18n.js';
import { useRovingFocus } from '../../hooks/useRovingFocus.js';
import { cn } from '../../utils/cn.js';
import { RATINGS, starClass } from './Stars.jsx';

// Five stars as a radio group: click or use the arrow keys, which follow the reading direction.
export const StarRatingField = ({ label, error, required, value, onChange }) => {
  const { t } = useI18n();
  const [preview, setPreview] = useState(null);
  const rating = Number(value) || 0;
  const shown = preview ?? rating;
  const itemProps = useRovingFocus({
    count: RATINGS.length,
    selectedIndex: rating - 1,
    onSelect: (index) => onChange(RATINGS[index]),
  });

  return (
    <FieldShell label={label} error={error} required={required}>
      {({ labelId, messageId, invalid }) => (
        <div
          role="radiogroup"
          aria-labelledby={labelId}
          aria-describedby={messageId}
          aria-invalid={invalid}
          aria-required={required || undefined}
          className="flex gap-1"
          onMouseLeave={() => setPreview(null)}
        >
          {RATINGS.map((star, index) => (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={rating === star}
              aria-label={t('reviews.stars', { count: star })}
              onClick={() => onChange(star)}
              onMouseEnter={() => setPreview(star)}
              className="press grid size-11 place-items-center rounded-lg hover:bg-warning-soft"
              {...itemProps(index)}
            >
              <Icon name="star" className={cn('size-8', starClass(star <= shown))} />
            </button>
          ))}
        </div>
      )}
    </FieldShell>
  );
};
