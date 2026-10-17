import { dashboardApi } from '../../../api/dashboard.js';
import { BilingualField } from '../../../components/BilingualField.jsx';
import { FormField } from '../../../components/FormField.jsx';
import { FormModal } from '../../../components/FormModal.jsx';
import { SLOT_DURATION } from '../../../config/constants.js';
import { emptyMediaValues, withMediaIds } from '../../../config/mediaSlots.js';
import { PERMISSIONS } from '../../../config/permissions.js';
import { useAuth } from '../../../hooks/useAuth.js';
import { useI18n } from '../../../hooks/useI18n.js';
import { useSubmitForm } from '../../../hooks/useSubmitForm.js';
import { pickValues } from '../../../utils/object.js';
import { clinicSchema } from '../../../validators/clinic.js';
import { ImagePicker } from '../../media/ImagePicker.jsx';

const EMPTY_CLINIC = {
  nameAr: '',
  nameEn: '',
  cityAr: '',
  cityEn: '',
  addressAr: '',
  addressEn: '',
  phone: '',
  mapUrl: '',
  slotDurationMinutes: 20,
  ...emptyMediaValues('clinic'),
};

export const ClinicFormModal = ({ clinic, onClose, onSaved }) => {
  const { t, pick } = useI18n();
  const { can } = useAuth();
  const form = useSubmitForm({
    initialValues: pickValues(clinic, EMPTY_CLINIC),
    schema: clinicSchema,
    submit: (values) => {
      const payload = withMediaIds('clinic', values);
      return clinic ? dashboardApi.clinics.replace(clinic.id, payload) : dashboardApi.clinics.create(payload);
    },
    onSaved,
  });

  return (
    <FormModal
      size="lg"
      title={
        clinic
          ? t('dashboard.clinics.form.editTitle', { name: pick(clinic, 'name') })
          : t('dashboard.clinics.form.newTitle')
      }
      description={clinic ? undefined : t('dashboard.clinics.form.newDescription')}
      form={form}
      onClose={onClose}
    >
      <BilingualField form={form} name="name" label={t('dashboard.clinics.form.name')} required />
      <BilingualField form={form} name="city" label={t('dashboard.clinics.form.city')} required />
      <BilingualField form={form} name="address" label={t('dashboard.clinics.form.address')} required />
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          label={t('dashboard.clinics.form.phone')}
          type="tel"
          dir="ltr"
          inputMode="tel"
          required
          {...form.register('phone')}
        />
        <FormField
          label={t('dashboard.clinics.form.slotDuration')}
          type="number"
          inputMode="numeric"
          min={SLOT_DURATION.min}
          max={SLOT_DURATION.max}
          hint={t('dashboard.clinics.form.slotDurationHint')}
          required
          {...form.register('slotDurationMinutes')}
        />
        <FormField
          label={t('dashboard.clinics.form.mapUrl')}
          type="url"
          dir="ltr"
          className="sm:col-span-2"
          hint={t('common.optional')}
          {...form.register('mapUrl')}
        />
      </div>
      {can(PERMISSIONS.MEDIA_MANAGE) && (
        <>
          <ImagePicker label={t('dashboard.clinics.form.cover')} {...form.register('coverImage')} />
          <ImagePicker label={t('dashboard.clinics.form.gallery')} multiple {...form.register('gallery')} />
        </>
      )}
    </FormModal>
  );
};
