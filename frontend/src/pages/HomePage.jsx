import { CallToAction } from '../components/CallToAction.jsx';
import { Section } from '../components/Section.jsx';
import { SectionLink } from '../components/SectionLink.jsx';
import { Seo } from '../components/Seo.jsx';
import { PATHS } from '../config/navigation.js';
import { useAboutContent } from '../features/about/useAboutContent.js';
import { ClinicList } from '../features/clinics/ClinicList.jsx';
import { Hero } from '../features/home/Hero.jsx';
import { StatsBar } from '../features/home/StatsBar.jsx';
import { WhyChooseUs } from '../features/home/WhyChooseUs.jsx';
import { ReviewHighlights } from '../features/reviews/ReviewsSection.jsx';
import { ServiceList } from '../features/services/ServiceList.jsx';
import { useI18n } from '../hooks/useI18n.js';

export default function HomePage() {
  const { t } = useI18n();
  const { data: about } = useAboutContent();
  const stats = about?.items.stat;

  return (
    <>
      <Seo />
      <Hero heroImage={about?.profile.heroImage} headlineStat={stats?.[0]} />
      <StatsBar stats={stats} />
      <Section
        eyebrow={t('home.services.eyebrow')}
        title={t('home.services.title')}
        description={t('home.services.description')}
        action={<SectionLink to={PATHS.services}>{t('home.services.link')}</SectionLink>}
      >
        <ServiceList featuredOnly />
      </Section>
      <WhyChooseUs />
      <Section
        tone="muted"
        eyebrow={t('home.clinics.eyebrow')}
        title={t('home.clinics.title')}
        description={t('home.clinics.description')}
        action={<SectionLink to={PATHS.clinics}>{t('home.clinics.link')}</SectionLink>}
      >
        <ClinicList />
      </Section>
      <ReviewHighlights />
      <CallToAction />
    </>
  );
}
