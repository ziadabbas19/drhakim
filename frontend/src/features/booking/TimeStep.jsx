import { publicApi } from '../../api/public.js';
import { AsyncContent } from '../../components/AsyncContent.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { formatTime } from '../../utils/date.js';
import { ChoiceChip } from './ChoiceChip.jsx';

export const TimeStep = ({ clinicId, date, onSelect }) => {
  const slots = useFetch(() => publicApi.bookings.slots(clinicId, date), [clinicId, date]);

  return (
    <AsyncContent {...slots} onRetry={slots.reload} emptyMessage="لا توجد مواعيد متاحة في هذا اليوم، من فضلك اختر يومًا آخر">
      {(items) => (
        <>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
            {items.map(({ time, isBooked }) => (
              <ChoiceChip
                key={time}
                disabled={isBooked}
                onClick={() => onSelect(time)}
                aria-label={isBooked ? `${formatTime(time)} محجوز` : formatTime(time)}
              >
                <span className={isBooked ? 'line-through' : undefined}>{formatTime(time)}</span>
              </ChoiceChip>
            ))}
          </div>
          <p className="text-xs text-slate-500">المواعيد المشطوبة محجوزة بالفعل.</p>
        </>
      )}
    </AsyncContent>
  );
};
