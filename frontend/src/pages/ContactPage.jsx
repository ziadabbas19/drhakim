import { AsyncContent } from '../components/AsyncContent.jsx';
import { Card } from '../components/Card.jsx';
import { Icon } from '../components/Icon.jsx';
import { IconTile } from '../components/IconTile.jsx';
import { Ltr } from '../components/Ltr.jsx';
import { PageHeader } from '../components/PageHeader.jsx';
import { Section } from '../components/Section.jsx';
import { Seo } from '../components/Seo.jsx';
import { ClinicList } from '../features/clinics/ClinicList.jsx';
import { useContactChannels } from '../features/settings/contactChannels.js';
import { SocialLinks } from '../features/settings/SocialLinks.jsx';
import { useI18n } from '../hooks/useI18n.js';
import { useSiteSettings } from '../hooks/useSiteSettings.js';
import { Stagger } from '../motion/Stagger.jsx';

export default function ContactPage() {
  const { t } = useI18n();
  const siteSettings = useSiteSettings();
  const channels = useContactChannels();

  return (
    <>
      <Seo title={t('contact.pageTitle')} />
      <PageHeader eyebrow={t('contact.eyebrow')} title={t('contact.title')} description={t('contact.description')} />

      <Section>
        <AsyncContent
          {...siteSettings}
          data={siteSettings.isLoading ? null : siteSettings.settings}
          onRetry={siteSettings.reload}
        >
          {(settings) => (
            <div className="space-y-6">
              <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {channels.map(({ key, icon, label, value, linkProps }) => (
                  <Card as="a" key={key} {...linkProps} className="lift relative flex h-full items-center gap-4">
                    <IconTile name={icon} />
                    <span className="min-w-0">
                      <span className="block text-sm font-bold text-ink-subtle">{label}</span>
                      <span className="block truncate text-lg font-extrabold text-ink-strong">
                        <Ltr>{value}</Ltr>
                      </span>
                    </span>
                  </Card>
                ))}
              </Stagger>
              {settings.workingHoursNote && (
                <p className="flex items-start gap-2 rounded-xl bg-surface-tint p-4 text-ink-strong">
                  <Icon name="clock" className="mt-0.5 size-5 shrink-0 text-primary" />
                  {settings.workingHoursNote}
                </p>
              )}
              <SocialLinks />
            </div>
          )}
        </AsyncContent>
      </Section>

      <Section tone="muted" title={t('clinics.addresses.title')} eyebrow={t('clinics.addresses.eyebrow')}>
        <ClinicList showSchedule={false} />
      </Section>
    </>
  );
}
