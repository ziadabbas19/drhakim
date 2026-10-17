import { WhatsAppCta } from '../features/settings/WhatsAppCta.jsx';
import { BookingButton } from './BookingButton.jsx';
import { GlowBlob } from './GlowBlob.jsx';
import { Section } from './Section.jsx';

export const CallToAction = () => (
  <Section>
    <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-brand-700 to-brand-950 px-6 py-12 text-center text-white sm:px-12 sm:py-16">
      <GlowBlob className="-top-20 -inset-e-20 size-64 bg-brand-400/20" />
      <div className="relative mx-auto max-w-2xl space-y-5">
        <h2 className="text-2xl font-extrabold sm:text-3xl">هل تعاني من مشكلة في الأنف أو الأذن أو الحنجرة؟</h2>
        <p className="leading-relaxed text-brand-100">
          احجز موعدك أونلاين في أقرب عيادة إليك خلال دقيقة واحدة، وستتواصل معك العيادة لتأكيد الحجز.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <BookingButton variant="light" size="lg">
            احجز كشف الآن
          </BookingButton>
          <WhatsAppCta size="lg" />
        </div>
      </div>
    </div>
  </Section>
);
