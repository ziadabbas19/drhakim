import { dashboardApi } from '../../../api/dashboard.js';
import { BilingualField } from '../../../components/BilingualField.jsx';
import { CheckboxField, FormField } from '../../../components/FormField.jsx';
import { FormModal } from '../../../components/FormModal.jsx';
import { IconTile } from '../../../components/IconTile.jsx';
import { OPTION_GROUPS } from '../../../config/constants.js';
import { emptyMediaValues, withMediaIds } from '../../../config/mediaSlots.js';
import { PERMISSIONS } from '../../../config/permissions.js';
import { useAuth } from '../../../hooks/useAuth.js';
import { useI18n } from '../../../hooks/useI18n.js';
import { useOptions } from '../../../hooks/useOptions.js';
import { useSubmitForm } from '../../../hooks/useSubmitForm.js';
import { pickValues } from '../../../utils/object.js';
import { serviceSchema } from '../../../validators/service.js';
import { ImagePicker } from '../../media/ImagePicker.jsx';

const EMPTY_SERVICE = {
  titleAr: '',
  titleEn: '',
  descriptionAr: '',
  descriptionEn: '',
  icon: OPTION_GROUPS.serviceIcon[0],
  isFeatured: false,
  ...emptyMediaValues('service'),
};

export const ServiceFormModal = ({ service, onClose, onSaved }) => {
  const { t } = useI18n();
  const { can } = useAuth();
  const iconOptions = useOptions('serviceIcon');
  const form = useSubmitForm({
    initialValues: pickValues(service, EMPTY_SERVICE),
    schema: serviceSchema,
    submit: (values) => {
      const payload = withMediaIds('service', values);
      return service ? dashboardApi.services.replace(service.id, payload) : dashboardApi.services.create(payload);
    },
    onSaved,
  });

  return (
    <FormModal
      size="lg"
      title={service ? t('dashboard.services.form.editTitle') : t('dashboard.services.form.newTitle')}
      form={form}
      onClose={onClose}
    >
      <BilingualField form={form} name="title" label={t('dashboard.services.form.title')} required />
      <BilingualField
        form={form}
        name="description"
        label={t('dashboard.services.form.description')}
        as="textarea"
        rows={4}
        maxLength={1000}
        required
      />
      <div className="flex items-end gap-3">
        <FormField
          label={t('dashboard.services.form.icon')}
          as="select"
          options={iconOptions}
          className="flex-1"
          required
          {...form.register('icon')}
        />
        <IconTile name={form.values.icon} size="sm" className="size-11" />
      </div>
      <CheckboxField
        label={t('dashboard.services.form.featured')}
        description={t('dashboard.services.form.featuredHint')}
        {...form.register('isFeatured')}
      />
      {can(PERMISSIONS.MEDIA_MANAGE) && (
        <ImagePicker
          label={t('dashboard.services.form.image')}
          hint={t('dashboard.services.form.imageHint')}
          {...form.register('image')}
        />
      )}
    </FormModal>
  );
};
