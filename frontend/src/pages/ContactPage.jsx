import { AsyncContent } from '../components/AsyncContent.jsx';
import { Card } from '../components/Card.jsx';
import { Icon } from '../components/Icon.jsx';
import { IconTile } from '../components/IconTile.jsx';
import { PageHeader } from '../components/PageHeader.jsx';
import { Section } from '../components/Section.jsx';
import { Seo } from '../components/Seo.jsx';
import { ClinicList } from '../features/clinics/ClinicList.jsx';
import { getContactChannels } from '../features/settings/contactChannels.js';
import { SocialLinks } from '../features/settings/SocialLinks.jsx';
import { useSiteSettings } from '../hooks/useSiteSettings.js';

export default function ContactPage() {
  const siteSettings = useSiteSettings();

  return (
    <>
      <Seo title="تواصل معنا" />
      <PageHeader
        eyebrow="تواصل معنا"
        title="نسعد بتواصلك"
        description="للاستفسار أو الحجز تواصل معنا بالهاتف أو واتساب، أو زر أقرب عيادة إليك."
      />

      <Section>
        <AsyncContent {...siteSettings} data={siteSettings.isLoading ? null : siteSettings.settings} onRetry={siteSettings.reload}>
          {(settings) => (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {getContactChannels(settings).map(({ key, icon, label, value, linkProps }) => (
                  <Card
                    as="a"
                    key={key}
                    {...linkProps}
                    className="flex items-center gap-4 transition-shadow hover:shadow-soft"
                  >
                    <IconTile name={icon} />
                    <span className="min-w-0">
                      <span className="block text-sm font-bold text-slate-500">{label}</span>
                      <span className="block truncate text-lg font-extrabold text-brand-950">
                        <span dir="ltr">{value}</span>
                      </span>
                    </span>
                  </Card>
                ))}
              </div>
              {settings.workingHoursNote && (
                <p className="flex items-start gap-2 rounded-xl bg-brand-50 p-4 text-brand-900">
                  <Icon name="clock" className="mt-0.5 size-5 shrink-0" />
                  {settings.workingHoursNote}
                </p>
              )}
              <SocialLinks />
            </div>
          )}
        </AsyncContent>
      </Section>

      <Section tone="muted" title="عناوين العيادات" eyebrow="العيادات">
        <ClinicList showSchedule={false} />
      </Section>
    </>
  );
}
