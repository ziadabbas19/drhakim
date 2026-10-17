import { Link } from 'react-router';
import { Badge } from '../../components/Badge.jsx';
import { BookingButton } from '../../components/BookingButton.jsx';
import { Button } from '../../components/Button.jsx';
import { Container } from '../../components/Container.jsx';
import { GlowBlob } from '../../components/GlowBlob.jsx';
import { Icon } from '../../components/Icon.jsx';
import { ResponsiveImage } from '../../components/ResponsiveImage.jsx';
import { PATHS } from '../../config/navigation.js';
import { useContent } from '../../hooks/useContent.js';
import { useI18n } from '../../hooks/useI18n.js';
import { Reveal } from '../../motion/Reveal.jsx';

const HERO_IMAGE_SIZES = '(min-width: 1024px) 28rem, (min-width: 640px) 24rem, 18rem';

// The illustrated card is shown until a home page image is added from the dashboard.
const HeroArtwork = ({ image, alt }) =>
  image ? (
    <ResponsiveImage
      media={image}
      alt={alt}
      sizes={HERO_IMAGE_SIZES}
      priority
      className="aspect-square rounded-[2.5rem] shadow-soft"
    />
  ) : (
    <div
      aria-hidden="true"
      className="relative aspect-square rounded-[2.5rem] bg-linear-to-br from-hero-from via-hero-via to-hero-to shadow-soft"
    >
      <div className="absolute inset-8 rounded-full border border-on-inverse/15" />
      <div className="absolute inset-16 rounded-full border border-on-inverse/20" />
      <div className="absolute inset-0 grid place-items-center">
        <span className="grid size-32 place-items-center rounded-full bg-on-inverse/10 text-on-inverse backdrop-blur-sm sm:size-40">
          <Icon name="ear" className="size-16 sm:size-20" strokeWidth={1.5} />
        </span>
      </div>
    </div>
  );

const HeroVisual = ({ image, headlineStat }) => {
  const { t } = useI18n();
  const { doctor } = useContent();

  return (
    <div className="relative mx-auto w-full max-w-72 sm:max-w-sm lg:max-w-md">
      <HeroArtwork image={image} alt={t('about.portraitAlt', { name: doctor.name })} />
      <div className="absolute -bottom-5 -inset-s-3 flex items-center gap-3 rounded-2xl bg-surface p-3 pe-5 shadow-soft sm:-inset-s-8">
        <span className="grid size-11 place-items-center rounded-xl bg-success-soft text-success-ink">
          <Icon name="calendarCheck" />
        </span>
        <span className="text-sm leading-tight">
          <span className="block font-extrabold text-ink-strong">{t('home.hero.bookOnline')}</span>
          <span className="text-ink-subtle">{t('home.hero.bookOnlineHint')}</span>
        </span>
      </div>
      {headlineStat && (
        <div className="absolute -top-4 -inset-e-2 rounded-2xl bg-surface px-4 py-3 text-center shadow-soft sm:-inset-e-6">
          <span dir="ltr" className="block text-2xl font-extrabold text-primary-ink">
            {headlineStat.value}
          </span>
          <span className="text-xs font-semibold text-ink-subtle">{headlineStat.title}</span>
        </div>
      )}
    </div>
  );
};

// The heading and tagline only move in (no fade), so the page's main content paints immediately.
export const Hero = ({ heroImage, headlineStat }) => {
  const { t } = useI18n();
  const { doctor, heroHighlights } = useContent();

  return (
    <section className="relative overflow-hidden bg-linear-to-b from-surface-tint via-canvas to-canvas">
      <GlowBlob className="-top-32 -inset-e-32 size-96" />
      <Container className="relative grid items-center gap-14 py-14 sm:py-20 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-6">
          <Reveal>
            <Badge tone="brand" className="px-3 py-1 text-sm">
              <Icon name="badge" className="size-4" />
              {doctor.title}
            </Badge>
          </Reveal>
          <Reveal
            as="h1"
            variant="rise"
            delay={60}
            className="text-4xl leading-tight font-extrabold text-ink-strong sm:text-5xl"
          >
            {doctor.name}
          </Reveal>
          <Reveal as="p" variant="rise" delay={120} className="max-w-xl text-lg leading-relaxed text-ink-muted">
            {doctor.tagline}
          </Reveal>
          <Reveal delay={180} className="flex flex-wrap gap-3">
            <BookingButton size="lg" />
            <Button as={Link} to={PATHS.clinics} size="lg" variant="secondary" icon="mapPin">
              {t('home.hero.clinicHours')}
            </Button>
          </Reveal>
          <Reveal as="ul" delay={240} className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold text-ink-muted">
            {heroHighlights.map((highlight) => (
              <li key={highlight} className="flex items-center gap-1.5">
                <Icon name="check" className="size-4.5 text-success" />
                {highlight}
              </li>
            ))}
          </Reveal>
        </div>
        <Reveal variant="rise" delay={120}>
          <HeroVisual image={heroImage} headlineStat={headlineStat} />
        </Reveal>
      </Container>
    </section>
  );
};
