import { publicApi } from '../../api/public.js';
import { AsyncContent } from '../../components/AsyncContent.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { formatDate } from '../../utils/date.js';
import { ChoiceChip } from './ChoiceChip.jsx';

export const DateStep = ({ clinicId, onSelect }) => {
  const dates = useFetch(() => publicApi.clinics.availableDates(clinicId), [clinicId]);

  return (
    <AsyncContent
      {...dates}
      onRetry={dates.reload}
      emptyMessage="لا توجد أيام متاحة للحجز في هذه العيادة خلال الثلاثين يومًا القادمة"
    >
      {(items) => (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5">
          {items.map(({ date, freeSlots }) => (
            <ChoiceChip
              key={date}
              disabled={freeSlots === 0}
              onClick={() => onSelect(date)}
              aria-label={formatDate(date, 'medium')}
              className="flex-col py-3"
            >
              <span className="text-xs font-semibold">{formatDate(date, 'weekday')}</span>
              <span className="text-base">{formatDate(date, 'short')}</span>
              <span className={freeSlots ? 'text-xs text-emerald-700' : 'text-xs'}>{freeSlots ? 'متاح' : 'مكتمل'}</span>
            </ChoiceChip>
          ))}
        </div>
      )}
    </AsyncContent>
  );
};
