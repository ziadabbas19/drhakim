import { useEffect } from 'react';
import { publicApi } from '../../api/public.js';
import { AsyncContent } from '../../components/AsyncContent.jsx';
import { Icon } from '../../components/Icon.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { useI18n } from '../../hooks/useI18n.js';
import { Stagger } from '../../motion/Stagger.jsx';
import { ChoiceChip } from './ChoiceChip.jsx';

export const ClinicStep = ({ preselectedId, onSelect }) => {
  const { t } = useI18n();
  const clinics = useFetch(publicApi.clinics.list, []);

  useEffect(() => {
    const preselected = clinics.data?.find((clinic) => clinic.id === preselectedId);
    if (preselected) onSelect(preselected);
  }, [clinics.data, preselectedId, onSelect]);

  return (
    <AsyncContent {...clinics} onRetry={clinics.reload} emptyMessage={t('booking.noClinics')}>
      {(items) => (
        <Stagger className="grid gap-3 sm:grid-cols-2">
          {items.map((clinic) => (
            <ChoiceChip
              key={clinic.id}
              onClick={() => onSelect(clinic)}
              className="h-full flex-col items-start gap-1.5 p-4 text-start"
            >
              <span className="flex items-center gap-2 text-base text-ink-strong">
                <Icon name="building" className="size-5 text-primary" />
                {clinic.name}
              </span>
              <span className="text-xs font-semibold text-ink-subtle">
                {clinic.city} – {clinic.address}
              </span>
            </ChoiceChip>
          ))}
        </Stagger>
      )}
    </AsyncContent>
  );
};
