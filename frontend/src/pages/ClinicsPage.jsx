import { CallToAction } from '../components/CallToAction.jsx';
import { PageHeader } from '../components/PageHeader.jsx';
import { Section } from '../components/Section.jsx';
import { Seo } from '../components/Seo.jsx';
import { ClinicList } from '../features/clinics/ClinicList.jsx';

export default function ClinicsPage() {
  return (
    <>
      <Seo title="العيادات ومواعيد العمل" />
      <PageHeader
        eyebrow="العيادات"
        title="العيادات ومواعيد العمل"
        description="يستقبل الدكتور مرضاه في عيادتي السنطة والقاهرة. اختر العيادة الأقرب إليك واحجز موعدك مباشرة."
      />
      <Section>
        <ClinicList />
      </Section>
      <CallToAction />
    </>
  );
}
