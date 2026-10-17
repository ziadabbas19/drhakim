import { Link } from 'react-router';
import { Button } from '../../components/Button.jsx';
import { Card } from '../../components/Card.jsx';
import { DetailList } from '../../components/DetailList.jsx';
import { Icon } from '../../components/Icon.jsx';
import { PATHS } from '../../config/navigation.js';
import { useToast } from '../../hooks/useToast.js';
import { formatDate, formatTime } from '../../utils/date.js';
import { clinicLabel } from '../clinics/clinicLabel.js';
import { WhatsAppCta } from '../settings/WhatsAppCta.jsx';

export const BookingConfirmation = ({ booking, onNewBooking }) => {
  const toast = useToast();

  const copyReference = () =>
    Promise.resolve()
      .then(() => navigator.clipboard.writeText(booking.referenceCode))
      .then(
        () => toast.success('تم نسخ رقم الحجز'),
        () => toast.error('تعذر النسخ، يمكنك كتابة الرقم يدويًا'),
      );

  const details = [
    { label: 'العيادة', value: clinicLabel(booking.clinic) },
    { label: 'العنوان', value: booking.clinic.address },
    { label: 'اليوم', value: formatDate(booking.date) },
    { label: 'الموعد', value: formatTime(booking.time) },
    { label: 'اسم المريض', value: booking.patientName },
    { label: 'رقم الموبايل', value: booking.phone, ltr: true },
  ];

  return (
    <Card className="space-y-6">
      <div className="space-y-3 text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-100 text-emerald-700">
          <Icon name="check" className="size-9" />
        </span>
        <h2 className="text-2xl font-extrabold text-brand-950">تم تسجيل حجزك بنجاح</h2>
        <p className="text-slate-600">احتفظ برقم الحجز، وستتواصل معك العيادة قريبًا لتأكيد الموعد.</p>
      </div>

      <div className="space-y-2 rounded-2xl border-2 border-dashed border-brand-200 bg-brand-50 p-5 text-center">
        <p className="text-sm font-bold text-brand-700">رقم الحجز</p>
        <p dir="ltr" className="text-3xl font-extrabold tracking-widest text-brand-950">
          {booking.referenceCode}
        </p>
        <Button variant="ghost" size="sm" icon="copy" onClick={copyReference}>
          نسخ الرقم
        </Button>
      </div>

      <DetailList items={details} />

      <div className="flex flex-wrap justify-center gap-3">
        <Button as={Link} to={PATHS.home} icon="arrowBack">
          العودة للرئيسية
        </Button>
        <Button variant="secondary" icon="plus" onClick={onNewBooking}>
          حجز موعد آخر
        </Button>
        <WhatsAppCta>تواصل مع العيادة</WhatsAppCta>
      </div>
    </Card>
  );
};
