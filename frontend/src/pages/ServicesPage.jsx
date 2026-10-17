import { CallToAction } from '../components/CallToAction.jsx';
import { PageHeader } from '../components/PageHeader.jsx';
import { Section } from '../components/Section.jsx';
import { Seo } from '../components/Seo.jsx';
import { ServiceList } from '../features/services/ServiceList.jsx';

export default function ServicesPage() {
  return (
    <>
      <Seo title="الخدمات والعمليات" />
      <PageHeader
        eyebrow="الخدمات والعمليات"
        title="علاج متكامل للأنف والأذن والحنجرة"
        description="نقدّم الفحص والتشخيص والعلاج الدوائي والجراحي للكبار والأطفال، مع متابعة دقيقة حتى التعافي الكامل."
      />
      <Section>
        <ServiceList />
      </Section>
      <CallToAction />
    </>
  );
}
