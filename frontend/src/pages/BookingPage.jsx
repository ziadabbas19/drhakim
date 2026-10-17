import { Card } from '../components/Card.jsx';
import { CardHeader } from '../components/CardHeader.jsx';
import { Container } from '../components/Container.jsx';
import { InfoRow } from '../components/InfoRow.jsx';
import { PageHeader } from '../components/PageHeader.jsx';
import { Seo } from '../components/Seo.jsx';
import { BookingWizard } from '../features/booking/BookingWizard.jsx';
import { WhatsAppCta } from '../features/settings/WhatsAppCta.jsx';
import { useContent } from '../hooks/useContent.js';
import { useI18n } from '../hooks/useI18n.js';
import { Reveal } from '../motion/Reveal.jsx';

export default function BookingPage() {
  const { t } = useI18n();
  const { bookingNotes } = useContent();

  return (
    <>
      <Seo title={t('booking.pageTitle')} />
      <PageHeader eyebrow={t('booking.eyebrow')} title={t('booking.title')} description={t('booking.description')} />
      <Container className="grid grid-cols-1 gap-6 pb-16 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <BookingWizard />
        <Reveal as="aside" variant="end" className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <Card className="space-y-4">
            <CardHeader title={t('booking.beforeVisit')} />
            <ul className="space-y-3 text-sm leading-relaxed text-ink-muted">
              {bookingNotes.map((note) => (
                <InfoRow key={note} icon="check">
                  {note}
                </InfoRow>
              ))}
            </ul>
          </Card>
          <Card className="space-y-3">
            <CardHeader title={t('booking.needHelp')} description={t('booking.needHelpText')} />
            <WhatsAppCta size="sm" className="w-full" />
          </Card>
        </Reveal>
      </Container>
    </>
  );
}
