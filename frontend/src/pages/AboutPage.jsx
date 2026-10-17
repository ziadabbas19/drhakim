import { AsyncContent } from '../components/AsyncContent.jsx';
import { CallToAction } from '../components/CallToAction.jsx';
import { Card } from '../components/Card.jsx';
import { Icon } from '../components/Icon.jsx';
import { ImageGallery } from '../components/ImageGallery.jsx';
import { PageHeader } from '../components/PageHeader.jsx';
import { MediaImage } from '../components/ResponsiveImage.jsx';
import { RichText } from '../components/RichText.jsx';
import { Section } from '../components/Section.jsx';
import { Seo } from '../components/Seo.jsx';
import { SurgeryGallery } from '../features/about/SurgeryGallery.jsx';
import { useAboutContent } from '../features/about/useAboutContent.js';
import { AllReviews } from '../features/reviews/ReviewsSection.jsx';
import { useContent } from '../hooks/useContent.js';
import { useI18n } from '../hooks/useI18n.js';
import { Reveal } from '../motion/Reveal.jsx';
import { Stagger } from '../motion/Stagger.jsx';

const PORTRAIT_SIZES = '(min-width: 1024px) 22rem, (min-width: 640px) 60vw, 100vw';

const Profile = ({ profile }) => {
  const { t } = useI18n();
  const { doctor } = useContent();

  return (
    <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
      <Reveal variant="start" className="mx-auto w-full max-w-60 sm:max-w-xs lg:max-w-none">
        <MediaImage
          media={profile.portrait}
          fallbackIcon="user"
          alt={t('about.portraitAlt', { name: doctor.name })}
          sizes={PORTRAIT_SIZES}
          className="aspect-4/5 rounded-3xl shadow-soft"
        />
      </Reveal>
      <Reveal variant="end" className="space-y-5">
        {profile.headline && (
          <h2 className="text-2xl font-extrabold text-ink-strong sm:text-3xl">{profile.headline}</h2>
        )}
        {profile.bio && <RichText html={profile.bio} className="text-lg leading-loose text-ink" />}
      </Reveal>
    </div>
  );
};

const Qualifications = ({ items }) => (
  <Stagger as="ul" itemAs="li" className="grid gap-4 sm:grid-cols-2">
    {items.map(({ id, title, subtitle }) => (
      <Card key={id} className="flex h-full gap-3">
        <Icon name="graduation" className="mt-1 size-6 shrink-0 text-primary" />
        <span>
          <span className="block font-bold text-ink-strong">{title}</span>
          {subtitle && <span className="text-sm text-ink-subtle">{subtitle}</span>}
        </span>
      </Card>
    ))}
  </Stagger>
);

const Timeline = ({ items }) => (
  <Stagger
    as="ol"
    itemAs="li"
    variant="start"
    className="relative space-y-6 border-s-2 border-primary-line ps-6"
    itemClassName="relative"
  >
    {items.map(({ id, title, subtitle, body }) => (
      <div key={id}>
        <span
          aria-hidden="true"
          className="absolute top-1.5 inset-s-[-2.05rem] size-4 rounded-full border-4 border-canvas bg-primary shadow"
        />
        <Card className="space-y-1">
          <p className="text-sm font-bold text-primary-ink">{subtitle}</p>
          <h3 className="text-lg font-extrabold text-ink-strong">{title}</h3>
          {body && <p className="text-ink-muted">{body}</p>}
        </Card>
      </div>
    ))}
  </Stagger>
);

const Memberships = ({ items }) => (
  <Stagger as="ul" itemAs="li" className="grid gap-4 sm:grid-cols-2">
    {items.map(({ id, title }) => (
      <Card key={id} className="flex h-full items-center gap-3">
        <Icon name="badge" className="size-6 shrink-0 text-primary" />
        <span className="font-bold text-ink">{title}</span>
      </Card>
    ))}
  </Stagger>
);

export default function AboutPage() {
  const { t } = useI18n();
  const { doctor } = useContent();
  const about = useAboutContent();
  const profile = about.data?.profile;

  return (
    <>
      <Seo title={t('about.pageTitle')} />
      <PageHeader eyebrow={doctor.title} title={t('about.title', { name: doctor.name })} description={profile?.intro} />

      <AsyncContent {...about} onRetry={about.reload} reserveSpace>
        {({ items }) => (
          <>
            <Section>
              <Profile profile={profile} />
            </Section>

            {items.qualification.length > 0 && (
              <Section tone="muted" title={t('about.qualifications')}>
                <Qualifications items={items.qualification} />
              </Section>
            )}

            {items.timeline.length > 0 && (
              <Section title={t('about.timeline.title')} eyebrow={t('about.timeline.eyebrow')}>
                <Timeline items={items.timeline} />
              </Section>
            )}

            {items.membership.length > 0 && (
              <Section tone="muted" title={t('about.memberships.title')} eyebrow={t('about.memberships.eyebrow')}>
                <Memberships items={items.membership} />
              </Section>
            )}

            {profile.aboutGallery.length > 0 && (
              <Section title={t('about.gallery.title')} eyebrow={t('about.gallery.eyebrow')}>
                <ImageGallery images={profile.aboutGallery} alt={doctor.name} />
              </Section>
            )}

            {items.surgery.length > 0 && (
              <Section
                tone="muted"
                title={t('about.surgeries.title')}
                eyebrow={t('about.surgeries.eyebrow')}
                description={t('about.surgeries.description')}
              >
                <SurgeryGallery surgeries={items.surgery} />
              </Section>
            )}
          </>
        )}
      </AsyncContent>

      <AllReviews />
      <CallToAction />
    </>
  );
}
