import { Link } from 'react-router';
import { Button } from '../../components/Button.jsx';
import { Card } from '../../components/Card.jsx';
import { DetailList } from '../../components/DetailList.jsx';
import { Icon } from '../../components/Icon.jsx';
import { PATHS } from '../../config/navigation.js';
import { useFormat } from '../../hooks/useFormat.js';
import { useI18n } from '../../hooks/useI18n.js';
import { useToast } from '../../hooks/useToast.js';
import { Reveal } from '../../motion/Reveal.jsx';
import { clinicLabel } from '../clinics/clinicLabel.js';
import { WhatsAppCta } from '../settings/WhatsAppCta.jsx';

export const BookingConfirmation = ({ booking, onNewBooking }) => {
  const { t } = useI18n();
  const format = useFormat();
  const toast = useToast();

  const copyReference = () =>
    Promise.resolve()
      .then(() => navigator.clipboard.writeText(booking.referenceCode))
      .then(
        () => toast.success(t('booking.confirmation.copied')),
        () => toast.error(t('booking.confirmation.copyFailed')),
      );

  const details = [
    { label: t('booking.confirmation.clinic'), value: clinicLabel(booking.clinic) },
    { label: t('booking.confirmation.address'), value: booking.clinic.address },
    { label: t('booking.confirmation.day'), value: format.date(booking.date) },
    { label: t('booking.confirmation.time'), value: format.time(booking.time) },
    { label: t('booking.confirmation.patient'), value: booking.patientName },
    { label: t('booking.confirmation.mobile'), value: booking.phone, ltr: true },
  ];

  return (
    <Reveal as={Card} variant="scale" className="space-y-6">
      <div className="space-y-3 text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-success-soft text-success-ink">
          <Icon name="check" className="size-9" />
        </span>
        <h2 className="text-2xl font-extrabold text-ink-strong">{t('booking.confirmation.title')}</h2>
        <p className="text-ink-muted">{t('booking.confirmation.description')}</p>
      </div>

      <div className="space-y-2 rounded-2xl border-2 border-dashed border-primary-line bg-primary-faint p-5 text-center">
        <p className="text-sm font-bold text-primary-ink">{t('booking.confirmation.reference')}</p>
        <p dir="ltr" className="text-3xl font-extrabold tracking-widest text-ink-strong">
          {booking.referenceCode}
        </p>
        <Button variant="ghost" size="sm" icon="copy" onClick={copyReference}>
          {t('booking.confirmation.copy')}
        </Button>
      </div>

      <DetailList items={details} />

      <div className="flex flex-wrap justify-center gap-3">
        <Button as={Link} to={PATHS.home} icon="arrowBack">
          {t('booking.confirmation.backHome')}
        </Button>
        <Button variant="secondary" icon="plus" onClick={onNewBooking}>
          {t('booking.confirmation.another')}
        </Button>
        <WhatsAppCta>{t('contact.contactClinic')}</WhatsAppCta>
      </div>
    </Reveal>
  );
};
