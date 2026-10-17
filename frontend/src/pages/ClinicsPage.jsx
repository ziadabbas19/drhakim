import { CallToAction } from '../components/CallToAction.jsx';
import { PageHeader } from '../components/PageHeader.jsx';
import { Section } from '../components/Section.jsx';
import { Seo } from '../components/Seo.jsx';
import { ClinicList } from '../features/clinics/ClinicList.jsx';
import { useI18n } from '../hooks/useI18n.js';

export default function ClinicsPage() {
  const { t } = useI18n();

  return (
    <>
      <Seo title={t('clinics.pageTitle')} />
      <PageHeader eyebrow={t('clinics.eyebrow')} title={t('clinics.title')} description={t('clinics.description')} />
      <Section>
        <ClinicList showGallery headingLevel={2} />
      </Section>
      <CallToAction />
    </>
  );
}
