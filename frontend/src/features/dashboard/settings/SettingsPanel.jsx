import { dashboardApi } from '../../../api/dashboard.js';
import { AsyncContent } from '../../../components/AsyncContent.jsx';
import { Button } from '../../../components/Button.jsx';
import { Card } from '../../../components/Card.jsx';
import { CardHeader } from '../../../components/CardHeader.jsx';
import { Form } from '../../../components/Form.jsx';
import { FormField } from '../../../components/FormField.jsx';
import { useFetch } from '../../../hooks/useFetch.js';
import { useSiteSettings } from '../../../hooks/useSiteSettings.js';
import { useSubmitForm } from '../../../hooks/useSubmitForm.js';
import { pickValues } from '../../../utils/object.js';
import { settingsSchema } from '../../../validators/settings.js';
import { SOCIAL_CHANNELS } from '../../settings/contactChannels.js';
import { PanelHeader } from '../PanelHeader.jsx';

const SETTING_GROUPS = [
  {
    title: 'بيانات التواصل',
    fields: [
      { name: 'doctorPhone', label: 'هاتف الحجز والاستفسار', type: 'tel', dir: 'ltr' },
      {
        name: 'whatsappNumber',
        label: 'رقم واتساب',
        type: 'tel',
        dir: 'ltr',
        hint: 'رقم موبايل مصري يبدأ بـ 01، ويُستخدم في أزرار واتساب بالموقع',
      },
      { name: 'email', label: 'البريد الإلكتروني', type: 'email', dir: 'ltr' },
    ],
  },
  {
    title: 'روابط التواصل الاجتماعي',
    fields: SOCIAL_CHANNELS.map(({ key, label }) => ({ name: key, label, type: 'url', dir: 'ltr', placeholder: 'https://' })),
  },
  {
    title: 'ملاحظة للمرضى',
    fields: [
      {
        name: 'workingHoursNote',
        label: 'تظهر في صفحة التواصل وأسفل الموقع',
        as: 'textarea',
        rows: 3,
        maxLength: 300,
        wide: true,
      },
    ],
  },
];

const EMPTY_SETTINGS = Object.fromEntries(
  SETTING_GROUPS.flatMap(({ fields }) => fields).map(({ name }) => [name, '']),
);

const SettingsForm = ({ settings }) => {
  const siteSettings = useSiteSettings();
  const form = useSubmitForm({
    initialValues: pickValues(settings, EMPTY_SETTINGS),
    schema: settingsSchema,
    submit: dashboardApi.settings.update,
    onSaved: ({ data }) => {
      form.reset(pickValues(data, EMPTY_SETTINGS));
      siteSettings.reload();
    },
  });

  return (
    <Form form={form} className="space-y-6">
      {SETTING_GROUPS.map(({ title, fields }) => (
        <Card key={title} className="space-y-4">
          <CardHeader title={title} />
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map(({ name, wide, ...fieldProps }) => (
              <FormField key={name} className={wide ? 'sm:col-span-2' : undefined} {...fieldProps} {...form.register(name)} />
            ))}
          </div>
        </Card>
      ))}
      <Button type="submit" icon="check" isLoading={form.isSubmitting}>
        حفظ الإعدادات
      </Button>
    </Form>
  );
};

export const SettingsPanel = () => {
  const settings = useFetch(dashboardApi.settings.get, []);

  return (
    <>
      <PanelHeader title="إعدادات التواصل" description="أرقام التواصل والروابط التي تظهر للمرضى في كل صفحات الموقع." />
      <AsyncContent {...settings} onRetry={settings.reload}>
        {(data) => <SettingsForm settings={data} />}
      </AsyncContent>
    </>
  );
};
