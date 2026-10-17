import { Card } from '../components/Card.jsx';
import { CardHeader } from '../components/CardHeader.jsx';
import { Container } from '../components/Container.jsx';
import { InfoRow } from '../components/InfoRow.jsx';
import { PageHeader } from '../components/PageHeader.jsx';
import { Seo } from '../components/Seo.jsx';
import { bookingNotes } from '../config/content.js';
import { BookingWizard } from '../features/booking/BookingWizard.jsx';
import { WhatsAppCta } from '../features/settings/WhatsAppCta.jsx';

export default function BookingPage() {
  return (
    <>
      <Seo title="احجز كشف" />
      <PageHeader
        eyebrow="الحجز أونلاين"
        title="احجز كشفك في دقيقة"
        description="اختر العيادة واليوم والموعد المناسب، ثم اكتب بياناتك لتأكيد الحجز."
      />
      <Container className="grid grid-cols-1 gap-6 pb-16 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <BookingWizard />
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <Card className="space-y-4">
            <CardHeader title="قبل زيارتك" />
            <ul className="space-y-3 text-sm leading-relaxed text-slate-600">
              {bookingNotes.map((note) => (
                <InfoRow key={note} icon="check">
                  {note}
                </InfoRow>
              ))}
            </ul>
          </Card>
          <Card className="space-y-3">
            <CardHeader title="تحتاج مساعدة؟" description="تواصل معنا عبر واتساب وسنرد عليك في أقرب وقت." />
            <WhatsAppCta size="sm" className="w-full" />
          </Card>
        </aside>
      </Container>
    </>
  );
}
