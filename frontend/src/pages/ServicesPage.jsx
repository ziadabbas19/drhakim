import { CallToAction } from '../components/CallToAction.jsx';
import { PageHeader } from '../components/PageHeader.jsx';
import { Section } from '../components/Section.jsx';
import { Seo } from '../components/Seo.jsx';
import { ServiceList } from '../features/services/ServiceList.jsx';
import { useI18n } from '../hooks/useI18n.js';

export default function ServicesPage() {
  const { t } = useI18n();

  return (
    <>
      <Seo title={t('services.pageTitle')} />
      <PageHeader eyebrow={t('services.eyebrow')} title={t('services.title')} description={t('services.description')} />
      <Section>
        <ServiceList headingLevel={2} />
      </Section>
      <CallToAction />
    </>
  );
}
