import { CallToAction } from '../components/CallToAction.jsx';
import { Section } from '../components/Section.jsx';
import { SectionLink } from '../components/SectionLink.jsx';
import { Seo } from '../components/Seo.jsx';
import { PATHS } from '../config/navigation.js';
import { ClinicList } from '../features/clinics/ClinicList.jsx';
import { Hero } from '../features/home/Hero.jsx';
import { StatsBar } from '../features/home/StatsBar.jsx';
import { Testimonials } from '../features/home/Testimonials.jsx';
import { WhyChooseUs } from '../features/home/WhyChooseUs.jsx';
import { ServiceList } from '../features/services/ServiceList.jsx';

export default function HomePage() {
  return (
    <>
      <Seo />
      <Hero />
      <StatsBar />
      <Section
        eyebrow="الخدمات والعمليات"
        title="أبرز ما نقدمه لمرضانا"
        description="من الفحص بالمنظار حتى الجراحات الدقيقة، خطة علاج واضحة لكل حالة."
        action={<SectionLink to={PATHS.services}>كل الخدمات</SectionLink>}
      >
        <ServiceList featuredOnly />
      </Section>
      <WhyChooseUs />
      <Section
        tone="muted"
        eyebrow="العيادات"
        title="أقرب عيادة إليك"
        description="اختر العيادة المناسبة واطّلع على مواعيد العمل قبل الحجز."
        action={<SectionLink to={PATHS.clinics}>تفاصيل العيادات</SectionLink>}
      >
        <ClinicList />
      </Section>
      <Testimonials />
      <CallToAction />
    </>
  );
}
