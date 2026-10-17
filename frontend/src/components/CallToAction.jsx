import { WhatsAppCta } from '../features/settings/WhatsAppCta.jsx';
import { useI18n } from '../hooks/useI18n.js';
import { Reveal } from '../motion/Reveal.jsx';
import { BookingButton } from './BookingButton.jsx';
import { GlowBlob } from './GlowBlob.jsx';
import { Section } from './Section.jsx';

export const CallToAction = () => {
  const { t } = useI18n();

  return (
    <Section>
      <Reveal
        variant="scale"
        className="relative overflow-hidden rounded-3xl bg-linear-to-br from-hero-via to-hero-to px-6 py-12 text-center text-on-inverse sm:px-12 sm:py-16"
      >
        <GlowBlob className="-top-20 -inset-e-20 size-64" />
        <div className="relative mx-auto max-w-2xl space-y-5">
          <h2 className="text-2xl font-extrabold sm:text-3xl">{t('cta.title')}</h2>
          <p className="leading-relaxed text-on-inverse-muted">{t('cta.description')}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <BookingButton variant="light" size="lg">
              {t('cta.book')}
            </BookingButton>
            <WhatsAppCta size="lg" />
          </div>
        </div>
      </Reveal>
    </Section>
  );
};
