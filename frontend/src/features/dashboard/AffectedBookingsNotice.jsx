import { Alert } from '../../components/Alert.jsx';
import { Button } from '../../components/Button.jsx';
import { Icon } from '../../components/Icon.jsx';
import { Ltr } from '../../components/Ltr.jsx';
import { PhoneLink } from '../../components/PhoneLink.jsx';
import { useFormat } from '../../hooks/useFormat.js';
import { useI18n } from '../../hooks/useI18n.js';

export const AffectedBookingsNotice = ({ bookings, onDismiss }) => {
  const { t } = useI18n();
  const format = useFormat();
  if (!bookings?.length) return null;

  return (
    <Alert
      tone="warning"
      title={t('dashboard.affected.title', { count: bookings.length })}
      action={
        <Button variant="ghost" size="icon" aria-label={t('common.dismiss')} onClick={onDismiss}>
          <Icon name="close" />
        </Button>
      }
    >
      <p>{t('dashboard.affected.text')}</p>
      <ul className="mt-3 space-y-2">
        {bookings.map((booking) => (
          <li
            key={booking.id}
            className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg bg-surface/70 px-3 py-2"
          >
            <span className="font-bold">
              {format.date(booking.date, 'medium')} – {format.time(booking.time)}
            </span>
            <span>{booking.patientName}</span>
            <PhoneLink phone={booking.phone} />
            <span className="font-mono text-xs">
              <Ltr>{booking.referenceCode}</Ltr>
            </span>
          </li>
        ))}
      </ul>
    </Alert>
  );
};
