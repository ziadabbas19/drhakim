import { useMemo } from 'react';
import { dashboardApi } from '../../../api/dashboard.js';
import { Alert } from '../../../components/Alert.jsx';
import { BilingualField } from '../../../components/BilingualField.jsx';
import { FormField } from '../../../components/FormField.jsx';
import { FormModal } from '../../../components/FormModal.jsx';
import { withMediaIds } from '../../../config/mediaSlots.js';
import { PERMISSIONS } from '../../../config/permissions.js';
import { useAuth } from '../../../hooks/useAuth.js';
import { useI18n } from '../../../hooks/useI18n.js';
import { useOptions } from '../../../hooks/useOptions.js';
import { useSubmitForm } from '../../../hooks/useSubmitForm.js';
import { pickValues } from '../../../utils/object.js';
import { aboutItemSchema } from '../../../validators/about.js';
import { ImagePicker } from '../../media/ImagePicker.jsx';
import { ABOUT_ITEM_TYPES, emptyAboutItem } from '../aboutItemTypes.js';

const AboutItemField = ({ type, field: { name, kind, required = false, hint }, form }) => {
  const { t } = useI18n();
  const { can } = useAuth();
  const categoryOptions = useOptions('surgeryCategory');
  const label = t(`dashboard.about.types.${type}.fields.${name}`);
  const hintText = hint ? t(`dashboard.about.types.${type}.fields.${name}Hint`) : undefined;

  switch (kind) {
    case 'text':
      return <BilingualField form={form} name={name} label={label} required={required} maxLength={200} />;
    case 'textarea':
      return (
        <BilingualField
          form={form}
          name={name}
          label={label}
          required={required}
          as="textarea"
          rows={4}
          maxLength={2000}
        />
      );
    case 'plain':
      return (
        <FormField
          label={label}
          hint={hintText}
          dir="ltr"
          required={required}
          maxLength={40}
          {...form.register(name)}
        />
      );
    case 'category':
      return (
        <FormField
          label={label}
          as="select"
          options={[{ value: '', label: t('options.surgeryCategory.none') }, ...categoryOptions]}
          {...form.register(name)}
        />
      );
    case 'gallery':
      return can(PERMISSIONS.MEDIA_MANAGE) ? <ImagePicker label={label} multiple {...form.register(name)} /> : null;
    default:
      return null;
  }
};

export const AboutItemFormModal = ({ type, item, onClose, onSaved }) => {
  const { t } = useI18n();
  const { fields, reminder } = ABOUT_ITEM_TYPES[type];
  const api = useMemo(() => dashboardApi.about.items(type), [type]);
  const typeLabel = t(`dashboard.about.types.${type}.item`);

  const form = useSubmitForm({
    initialValues: pickValues(item, emptyAboutItem(type)),
    schema: aboutItemSchema(type),
    submit: (values) => {
      const payload = withMediaIds('aboutItem', values);
      return item ? api.replace(item.id, payload) : api.create(payload);
    },
    onSaved,
  });

  return (
    <FormModal
      size="lg"
      title={t(item ? 'dashboard.about.list.editTitle' : 'dashboard.about.list.newTitle', { type: typeLabel })}
      form={form}
      onClose={onClose}
    >
      {reminder && <Alert tone="warning">{t(`dashboard.about.${reminder}`)}</Alert>}
      {fields.map((field) => (
        <AboutItemField key={field.name} type={type} field={field} form={form} />
      ))}
    </FormModal>
  );
};
