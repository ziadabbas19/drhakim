import { dashboardApi } from '../../../api/dashboard.js';
import { AsyncContent } from '../../../components/AsyncContent.jsx';
import { BilingualField } from '../../../components/BilingualField.jsx';
import { Button } from '../../../components/Button.jsx';
import { Card } from '../../../components/Card.jsx';
import { CardHeader } from '../../../components/CardHeader.jsx';
import { Form } from '../../../components/Form.jsx';
import { RichTextField } from '../../../components/RichTextField.jsx';
import { emptyMediaValues, withMediaIds } from '../../../config/mediaSlots.js';
import { PERMISSIONS } from '../../../config/permissions.js';
import { useAuth } from '../../../hooks/useAuth.js';
import { useFetch } from '../../../hooks/useFetch.js';
import { useI18n } from '../../../hooks/useI18n.js';
import { useSubmitForm } from '../../../hooks/useSubmitForm.js';
import { pickValues } from '../../../utils/object.js';
import { aboutProfileSchema } from '../../../validators/about.js';
import { ImagePicker } from '../../media/ImagePicker.jsx';

const EMPTY_PROFILE = {
  headlineAr: '',
  headlineEn: '',
  introAr: '',
  introEn: '',
  bioAr: '',
  bioEn: '',
  ...emptyMediaValues('site'),
};

const ProfileFields = ({ profile }) => {
  const { t } = useI18n();
  const { can } = useAuth();
  const form = useSubmitForm({
    initialValues: pickValues(profile, EMPTY_PROFILE),
    schema: aboutProfileSchema,
    submit: (values) => dashboardApi.about.updateProfile(withMediaIds('site', values)),
    onSaved: ({ data }) => form.reset(pickValues(data, EMPTY_PROFILE)),
  });

  return (
    <Form form={form} className="space-y-6">
      <Card className="space-y-5">
        <CardHeader title={t('dashboard.about.profile.texts')} />
        <BilingualField
          form={form}
          name="headline"
          label={t('dashboard.about.profile.headline')}
          required
          maxLength={150}
        />
        <BilingualField
          form={form}
          name="intro"
          label={t('dashboard.about.profile.intro')}
          required
          as="textarea"
          rows={3}
          maxLength={400}
        />
        <BilingualField
          form={form}
          name="bio"
          label={t('dashboard.about.profile.bio')}
          required
          field={RichTextField}
        />
      </Card>
      {can(PERMISSIONS.MEDIA_MANAGE) && (
        <Card className="space-y-5">
          <CardHeader title={t('dashboard.about.profile.images')} />
          <div className="grid gap-5 lg:grid-cols-2">
            <ImagePicker
              label={t('dashboard.about.profile.heroImage')}
              hint={t('dashboard.about.profile.heroImageHint')}
              {...form.register('heroImage')}
            />
            <ImagePicker label={t('dashboard.about.profile.portrait')} {...form.register('portrait')} />
          </div>
          <ImagePicker label={t('dashboard.about.profile.aboutGallery')} multiple {...form.register('aboutGallery')} />
        </Card>
      )}
      <Button type="submit" icon="check" isLoading={form.isSubmitting}>
        {t('dashboard.about.profile.save')}
      </Button>
    </Form>
  );
};

export const ProfileForm = () => {
  const profile = useFetch(dashboardApi.about.getProfile, []);

  return (
    <AsyncContent {...profile} onRetry={profile.reload}>
      {(data) => <ProfileFields profile={data} />}
    </AsyncContent>
  );
};
