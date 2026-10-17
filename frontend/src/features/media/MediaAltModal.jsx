import { dashboardApi } from '../../api/dashboard.js';
import { BilingualField } from '../../components/BilingualField.jsx';
import { FormModal } from '../../components/FormModal.jsx';
import { ResponsiveImage } from '../../components/ResponsiveImage.jsx';
import { useI18n } from '../../hooks/useI18n.js';
import { useSubmitForm } from '../../hooks/useSubmitForm.js';
import { pickValues } from '../../utils/object.js';
import { mediaAltSchema } from '../../validators/media.js';

const EMPTY_ALT = { altAr: '', altEn: '' };

export const MediaAltModal = ({ media, onClose, onSaved }) => {
  const { t } = useI18n();
  const form = useSubmitForm({
    initialValues: pickValues(media, EMPTY_ALT),
    schema: mediaAltSchema,
    submit: (values) => dashboardApi.media.update(media.id, values),
    onSaved,
  });

  return (
    <FormModal title={t('media.altTitle')} description={t('media.altDescription')} form={form} onClose={onClose}>
      <ResponsiveImage
        media={media}
        sizes="36rem"
        className="mx-auto aspect-video max-w-md rounded-xl"
        imgClassName="object-contain"
      />
      <BilingualField form={form} name="alt" label={t('media.alt')} required as="textarea" rows={2} maxLength={300} />
    </FormModal>
  );
};
