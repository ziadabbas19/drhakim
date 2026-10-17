import { publicApi } from '../../api/public.js';
import { AsyncContent } from '../../components/AsyncContent.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { useFormat } from '../../hooks/useFormat.js';
import { useI18n } from '../../hooks/useI18n.js';
import { Stagger } from '../../motion/Stagger.jsx';
import { ChoiceChip } from './ChoiceChip.jsx';

export const TimeStep = ({ clinicId, date, onSelect }) => {
  const { t } = useI18n();
  const format = useFormat();
  const slots = useFetch(() => publicApi.bookings.slots(clinicId, date), [clinicId, date]);

  return (
    <AsyncContent {...slots} onRetry={slots.reload} emptyMessage={t('booking.noTimes')}>
      {(items) => (
        <>
          <Stagger variant="fade" className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
            {items.map(({ time, isBooked }) => (
              <ChoiceChip
                key={time}
                disabled={isBooked}
                onClick={() => onSelect(time)}
                aria-label={isBooked ? t('booking.booked', { time: format.time(time) }) : format.time(time)}
              >
                <span className={isBooked ? 'line-through' : undefined}>{format.time(time)}</span>
              </ChoiceChip>
            ))}
          </Stagger>
          <p className="text-xs text-ink-subtle">{t('booking.bookedHint')}</p>
        </>
      )}
    </AsyncContent>
  );
};
