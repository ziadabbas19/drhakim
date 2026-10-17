import { publicApi } from '../../api/public.js';
import { AsyncContent } from '../../components/AsyncContent.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { useFormat } from '../../hooks/useFormat.js';
import { useI18n } from '../../hooks/useI18n.js';
import { Stagger } from '../../motion/Stagger.jsx';
import { ChoiceChip } from './ChoiceChip.jsx';

export const DateStep = ({ clinicId, onSelect }) => {
  const { t } = useI18n();
  const format = useFormat();
  const dates = useFetch(() => publicApi.clinics.availableDates(clinicId), [clinicId]);

  return (
    <AsyncContent {...dates} onRetry={dates.reload} emptyMessage={t('booking.noDates')}>
      {(items) => (
        <Stagger variant="fade" className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5">
          {items.map(({ date, freeSlots }) => (
            <ChoiceChip
              key={date}
              disabled={freeSlots === 0}
              onClick={() => onSelect(date)}
              aria-label={format.date(date, 'medium')}
              className="h-full flex-col py-3"
            >
              <span className="text-xs font-semibold">{format.date(date, 'weekday')}</span>
              <span className="text-base">{format.date(date, 'short')}</span>
              <span className={freeSlots ? 'text-xs text-success-ink' : 'text-xs'}>
                {freeSlots ? t('booking.available') : t('booking.full')}
              </span>
            </ChoiceChip>
          ))}
        </Stagger>
      )}
    </AsyncContent>
  );
};
