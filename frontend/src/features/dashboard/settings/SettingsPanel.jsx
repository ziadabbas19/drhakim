import { dashboardApi } from '../../../api/dashboard.js';
import { AsyncContent } from '../../../components/AsyncContent.jsx';
import { BilingualField } from '../../../components/BilingualField.jsx';
import { Button } from '../../../components/Button.jsx';
import { Card } from '../../../components/Card.jsx';
import { CardHeader } from '../../../components/CardHeader.jsx';
import { Form } from '../../../components/Form.jsx';
import { FormField } from '../../../components/FormField.jsx';
import { useFetch } from '../../../hooks/useFetch.js';
import { useI18n } from '../../../hooks/useI18n.js';
import { useSiteSettings } from '../../../hooks/useSiteSettings.js';
import { useSubmitForm } from '../../../hooks/useSubmitForm.js';
import { pickValues } from '../../../utils/object.js';
import { settingsSchema } from '../../../validators/settings.js';
import { SOCIAL_CHANNELS } from '../../settings/contactChannels.js';
import { PanelHeader } from '../PanelHeader.jsx';

const LINK_FIELD = { type: 'url', dir: 'ltr', placeholder: 'https://' };

const CONTACT_FIELDS = [
  { name: 'doctorPhone', label: 'dashboard.settings.fields.doctorPhone', type: 'tel', dir: 'ltr' },
  {
    name: 'whatsappNumber',
    label: 'dashboard.settings.fields.whatsappNumber',
    hint: 'dashboard.settings.fields.whatsappHint',
    type: 'tel',
    dir: 'ltr',
  },
  { name: 'email', label: 'dashboard.settings.fields.email', type: 'email', dir: 'ltr' },
];

const SOCIAL_FIELDS = SOCIAL_CHANNELS.map(({ key, label }) => ({ name: key, label, ...LINK_FIELD }));

const NOTE_FIELD = 'workingHoursNote';

const EMPTY_SETTINGS = Object.fromEntries(
  [...CONTACT_FIELDS, ...SOCIAL_FIELDS]
    .map(({ name }) => name)
    .concat(`${NOTE_FIELD}Ar`, `${NOTE_FIELD}En`)
    .map((name) => [name, '']),
);

const FieldGroup = ({ form, fields }) => {
  const { t } = useI18n();
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {fields.map(({ name, label, hint, ...fieldProps }) => (
        <FormField key={name} label={t(label)} hint={hint && t(hint)} {...fieldProps} {...form.register(name)} />
      ))}
    </div>
  );
};

const SettingsForm = ({ settings }) => {
  const { t } = useI18n();
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
      <Card className="space-y-4">
        <CardHeader title={t('dashboard.settings.groups.contact')} />
        <FieldGroup form={form} fields={CONTACT_FIELDS} />
      </Card>
      <Card className="space-y-4">
        <CardHeader title={t('dashboard.settings.groups.social')} />
        <FieldGroup form={form} fields={SOCIAL_FIELDS} />
      </Card>
      <Card className="space-y-4">
        <CardHeader
          title={t('dashboard.settings.groups.note')}
          description={t('dashboard.settings.fields.workingHoursNoteHint')}
        />
        <BilingualField
          form={form}
          name={NOTE_FIELD}
          label={t('dashboard.settings.fields.workingHoursNote')}
          as="textarea"
          rows={3}
          maxLength={300}
        />
      </Card>
      <Button type="submit" icon="check" isLoading={form.isSubmitting}>
        {t('dashboard.settings.save')}
      </Button>
    </Form>
  );
};

export const SettingsPanel = () => {
  const { t } = useI18n();
  const settings = useFetch(dashboardApi.settings.get, []);

  return (
    <>
      <PanelHeader title={t('dashboard.settings.title')} description={t('dashboard.settings.description')} />
      <AsyncContent {...settings} onRetry={settings.reload}>
        {(data) => <SettingsForm settings={data} />}
      </AsyncContent>
    </>
  );
};
