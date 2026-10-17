import { useCallback, useState } from 'react';
import { useSearchParams } from 'react-router';
import { publicApi } from '../../api/public.js';
import { Alert } from '../../components/Alert.jsx';
import { useForm } from '../../hooks/useForm.js';
import { formatDate, formatTime } from '../../utils/date.js';
import { patientSchema } from '../../validators/booking.js';
import { clinicLabel } from '../clinics/clinicLabel.js';
import { BookingConfirmation } from './BookingConfirmation.jsx';
import { ClinicStep } from './ClinicStep.jsx';
import { DateStep } from './DateStep.jsx';
import { PatientStep } from './PatientStep.jsx';
import { TimeStep } from './TimeStep.jsx';
import { useBookingSelection } from './useBookingSelection.js';
import { WizardStep } from './WizardStep.jsx';

const EMPTY_PATIENT = { patientName: '', phone: '', age: '', notes: '' };

// The slot was taken or became unavailable while the patient was filling the form.
const isSlotError = (error) => [400, 409].includes(error.status) && !error.fields;

export const BookingWizard = () => {
  const [searchParams] = useSearchParams();
  const [preselectedClinicId, setPreselectedClinicId] = useState(() => searchParams.get('clinic'));
  const [booking, setBooking] = useState(null);
  const [slotNotice, setSlotNotice] = useState('');
  const { selection, select, reset, statusOf } = useBookingSelection();
  const { clinic, date, time } = selection;

  const patientForm = useForm({
    initialValues: EMPTY_PATIENT,
    schema: patientSchema,
    onSubmit: async (patient) => {
      try {
        const { data } = await publicApi.bookings.create({ clinicId: clinic.id, date, time, ...patient });
        setBooking(data);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (error) {
        if (!isSlotError(error)) throw error;
        setSlotNotice(error.message);
        select('time', null);
      }
    },
  });

  const selectClinic = useCallback(
    (chosenClinic) => {
      setPreselectedClinicId(null);
      select('clinic', chosenClinic);
    },
    [select],
  );

  const selectTime = (chosenTime) => {
    setSlotNotice('');
    select('time', chosenTime);
  };

  const startOver = () => {
    setBooking(null);
    reset();
    patientForm.reset();
  };

  if (booking) return <BookingConfirmation booking={booking} onNewBooking={startOver} />;

  return (
    <div className="space-y-4">
      <WizardStep
        number={1}
        title="اختر العيادة"
        status={statusOf(0)}
        summary={clinic && clinicLabel(clinic)}
        onEdit={() => select('clinic', null)}
      >
        <ClinicStep preselectedId={preselectedClinicId} onSelect={selectClinic} />
      </WizardStep>

      <WizardStep
        number={2}
        title="اختر اليوم"
        status={statusOf(1)}
        summary={date && formatDate(date, 'medium')}
        onEdit={() => select('date', null)}
      >
        <DateStep clinicId={clinic?.id} onSelect={(chosenDate) => select('date', chosenDate)} />
      </WizardStep>

      <WizardStep
        number={3}
        title="اختر الموعد"
        status={statusOf(2)}
        summary={time && formatTime(time)}
        onEdit={() => select('time', null)}
      >
        {slotNotice && <Alert tone="warning">{slotNotice}</Alert>}
        <TimeStep clinicId={clinic?.id} date={date} onSelect={selectTime} />
      </WizardStep>

      <WizardStep number={4} title="بيانات المريض" status={statusOf(3)}>
        <PatientStep form={patientForm} />
      </WizardStep>
    </div>
  );
};
