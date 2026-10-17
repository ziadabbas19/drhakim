import { Badge } from '../../../components/Badge.jsx';
import { Button } from '../../../components/Button.jsx';
import { OPTION_TONES, REVIEW_STATUS } from '../../../config/constants.js';
import { useI18n } from '../../../hooks/useI18n.js';
import { useOptionLabel } from '../../../hooks/useOptions.js';
import { cn } from '../../../utils/cn.js';
import { DeleteButton, RowActions } from '../../dashboard/RowActions.jsx';

export const ReviewStatus = ({ review }) => {
  const { t } = useI18n();
  const optionLabel = useOptionLabel();

  return (
    <div className="flex flex-wrap gap-1.5">
      <Badge tone={OPTION_TONES.reviewStatus[review.status]}>{optionLabel('reviewStatus', review.status)}</Badge>
      {review.isFeatured && <Badge tone="brand">{t('dashboard.reviews.featured')}</Badge>}
    </div>
  );
};

// The actions available for a review in its current state. The table shows them compactly
// (icons on wide screens); the detail view shows them with their labels.
export const ReviewActions = ({ review, moderation, onView, compact = false }) => {
  const { t } = useI18n();
  const isApproved = review.status === REVIEW_STATUS.APPROVED;
  const label = (action) => t(`dashboard.reviews.actions.${action}`);
  const shared = { size: 'sm', compact };

  return (
    <RowActions className={cn(compact && 'md:flex-nowrap')}>
      {onView && (
        <Button variant="ghost" icon="show" onClick={() => onView(review)} {...shared}>
          {label('view')}
        </Button>
      )}
      {!isApproved && (
        <Button
          variant="ghostSuccess"
          icon="check"
          onClick={() => moderation.setStatus(review, REVIEW_STATUS.APPROVED)}
          {...shared}
        >
          {label('approve')}
        </Button>
      )}
      {review.status === REVIEW_STATUS.PENDING && (
        <Button
          variant="ghostDanger"
          icon="close"
          onClick={() => moderation.setStatus(review, REVIEW_STATUS.REJECTED)}
          {...shared}
        >
          {label('reject')}
        </Button>
      )}
      {isApproved && (
        <>
          <Button variant="ghost" icon="star" onClick={() => moderation.toggleFeatured(review)} {...shared}>
            {label(review.isFeatured ? 'unfeature' : 'feature')}
          </Button>
          <Button
            variant="ghost"
            icon="hide"
            onClick={() => moderation.setStatus(review, REVIEW_STATUS.REJECTED)}
            {...shared}
          >
            {label('hide')}
          </Button>
        </>
      )}
      <DeleteButton onClick={() => moderation.remove(review)} compact={compact} />
    </RowActions>
  );
};
