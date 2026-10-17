import { Alert } from '../../components/Alert.jsx';
import { Button } from '../../components/Button.jsx';
import { Icon } from '../../components/Icon.jsx';
import { PhoneLink } from '../../components/PhoneLink.jsx';
import { formatDate, formatTime } from '../../utils/date.js';
import { formatNumber } from '../../utils/number.js';

export const AffectedBookingsNotice = ({ bookings, onDismiss }) => {
  if (!bookings?.length) return null;

  return (
    <Alert
      tone="warning"
      title={`تنبيه: ${formatNumber(bookings.length)} من الحجوزات القادمة لم تعد ضمن مواعيد العمل`}
      action={
        <Button variant="ghost" size="icon" aria-label="إخفاء التنبيه" onClick={onDismiss}>
          <Icon name="close" />
        </Button>
      }
    >
      <p>لم يتم تعديل هذه الحجوزات أو إلغاؤها. يُرجى التواصل مع المرضى لتغيير مواعيدهم ثم تحديث حالة الحجز.</p>
      <ul className="mt-3 space-y-2">
        {bookings.map((booking) => (
          <li key={booking.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg bg-white/70 px-3 py-2">
            <span className="font-bold">
              {formatDate(booking.date, 'medium')} – {formatTime(booking.time)}
            </span>
            <span>{booking.patientName}</span>
            <PhoneLink phone={booking.phone} />
            <span dir="ltr" className="font-mono text-xs">
              {booking.referenceCode}
            </span>
          </li>
        ))}
      </ul>
    </Alert>
  );
};
