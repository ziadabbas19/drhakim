import { dashboardApi } from '../../../api/dashboard.js';
import { FormField } from '../../../components/FormField.jsx';
import { FormModal } from '../../../components/FormModal.jsx';
import { SLOT_DURATION } from '../../../config/constants.js';
import { useSubmitForm } from '../../../hooks/useSubmitForm.js';
import { pickValues } from '../../../utils/object.js';
import { clinicSchema } from '../../../validators/clinic.js';

const EMPTY_CLINIC = { name: '', city: '', address: '', phone: '', mapUrl: '', slotDurationMinutes: 20 };

export const ClinicFormModal = ({ clinic, onClose, onSaved }) => {
  const form = useSubmitForm({
    initialValues: pickValues(clinic, EMPTY_CLINIC),
    schema: clinicSchema,
    submit: (values) =>
      clinic ? dashboardApi.clinics.replace(clinic.id, values) : dashboardApi.clinics.create(values),
    onSaved,
  });

  return (
    <FormModal
      title={clinic ? `تعديل ${clinic.name}` : 'إضافة عيادة جديدة'}
      description={clinic ? undefined : 'بعد الإضافة يمكنك تحديد مواعيد العمل من صفحة العيادة.'}
      form={form}
      onClose={onClose}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="اسم العيادة" required {...form.register('name')} />
        <FormField label="المدينة" required {...form.register('city')} />
        <FormField label="العنوان بالتفصيل" required className="sm:col-span-2" {...form.register('address')} />
        <FormField label="رقم هاتف العيادة" type="tel" dir="ltr" inputMode="tel" required {...form.register('phone')} />
        <FormField
          label="مدة الكشف بالدقائق"
          type="number"
          inputMode="numeric"
          min={SLOT_DURATION.min}
          max={SLOT_DURATION.max}
          hint="تُقسَّم فترات العمل إلى مواعيد بهذه المدة"
          required
          {...form.register('slotDurationMinutes')}
        />
        <FormField
          label="رابط الموقع على خرائط جوجل"
          type="url"
          dir="ltr"
          className="sm:col-span-2"
          hint="اختياري"
          {...form.register('mapUrl')}
        />
      </div>
    </FormModal>
  );
};
