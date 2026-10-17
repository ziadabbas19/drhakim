import { useState } from 'react';
import { publicApi } from '../../api/public.js';
import { Button } from '../../components/Button.jsx';
import { FormField } from '../../components/FormField.jsx';
import { FormModal } from '../../components/FormModal.jsx';
import { REVIEW_LIMITS } from '../../config/constants.js';
import { useI18n } from '../../hooks/useI18n.js';
import { useSubmitForm } from '../../hooks/useSubmitForm.js';
import { reviewSchema } from '../../validators/review.js';
import { StarRatingField } from './StarRatingField.jsx';

const EMPTY_REVIEW = { patientName: '', city: '', rating: null, comment: '', website: '' };

// Hidden from people (visually, from the keyboard, and from screen readers). Automated form
// fillers complete it, and the API then quietly discards the submission.
const TrapField = ({ label, error, ...inputProps }) => (
  <div className="sr-only" aria-hidden="true">
    <label>
      {label}
      <input type="text" tabIndex={-1} autoComplete="off" {...inputProps} />
    </label>
  </div>
);

export const ReviewFormModal = ({ onClose }) => {
  const { t } = useI18n();
  const form = useSubmitForm({
    initialValues: EMPTY_REVIEW,
    schema: reviewSchema,
    submit: publicApi.reviews.create,
    onSaved: onClose,
  });

  return (
    <FormModal
      title={t('reviews.form.title')}
      description={t('reviews.form.description')}
      submitLabel={t('reviews.form.submit')}
      form={form}
      onClose={onClose}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          label={t('reviews.form.name')}
          autoComplete="name"
          maxLength={REVIEW_LIMITS.textMax}
          required
          {...form.register('patientName')}
        />
        <FormField
          label={t('reviews.form.city')}
          autoComplete="address-level2"
          maxLength={REVIEW_LIMITS.textMax}
          required
          {...form.register('city')}
        />
      </div>
      <StarRatingField label={t('reviews.form.rating')} required {...form.register('rating')} />
      <FormField
        as="textarea"
        rows={4}
        dir="auto"
        label={t('reviews.form.comment')}
        hint={t('reviews.form.commentHint', { max: REVIEW_LIMITS.commentMax })}
        maxLength={REVIEW_LIMITS.commentMax}
        {...form.register('comment')}
      />
      <TrapField label={t('reviews.form.trap')} {...form.register('website')} />
    </FormModal>
  );
};

export const AddReviewButton = (buttonProps) => {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button icon="star" onClick={() => setIsOpen(true)} {...buttonProps}>
        {t('reviews.add')}
      </Button>
      {isOpen && <ReviewFormModal onClose={() => setIsOpen(false)} />}
    </>
  );
};
