import { dashboardApi } from '../../../api/dashboard.js';
import { CheckboxField, FormField } from '../../../components/FormField.jsx';
import { FormModal } from '../../../components/FormModal.jsx';
import { IconTile } from '../../../components/IconTile.jsx';
import { SERVICE_ICON_OPTIONS } from '../../../config/constants.js';
import { useSubmitForm } from '../../../hooks/useSubmitForm.js';
import { pickValues } from '../../../utils/object.js';
import { serviceSchema } from '../../../validators/service.js';

const EMPTY_SERVICE = { title: '', description: '', icon: SERVICE_ICON_OPTIONS[0].value, isFeatured: false };

export const ServiceFormModal = ({ service, onClose, onSaved }) => {
  const form = useSubmitForm({
    initialValues: pickValues(service, EMPTY_SERVICE),
    schema: serviceSchema,
    submit: (values) =>
      service ? dashboardApi.services.replace(service.id, values) : dashboardApi.services.create(values),
    onSaved,
  });

  return (
    <FormModal title={service ? 'تعديل الخدمة' : 'إضافة خدمة جديدة'} form={form} onClose={onClose}>
      <FormField label="اسم الخدمة أو العملية" required {...form.register('title')} />
      <FormField as="textarea" label="الوصف" rows={4} maxLength={1000} required {...form.register('description')} />
      <div className="flex items-end gap-3">
        <FormField
          label="الأيقونة"
          as="select"
          options={SERVICE_ICON_OPTIONS}
          className="flex-1"
          required
          {...form.register('icon')}
        />
        <IconTile name={form.values.icon} size="sm" className="size-11" />
      </div>
      <CheckboxField
        label="خدمة مميزة"
        description="تظهر الخدمات المميزة في الصفحة الرئيسية"
        {...form.register('isFeatured')}
      />
    </FormModal>
  );
};
