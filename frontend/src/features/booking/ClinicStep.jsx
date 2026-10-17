import { useEffect } from 'react';
import { publicApi } from '../../api/public.js';
import { AsyncContent } from '../../components/AsyncContent.jsx';
import { Icon } from '../../components/Icon.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { ChoiceChip } from './ChoiceChip.jsx';

export const ClinicStep = ({ preselectedId, onSelect }) => {
  const clinics = useFetch(publicApi.clinics.list, []);

  useEffect(() => {
    const preselected = clinics.data?.find((clinic) => clinic.id === preselectedId);
    if (preselected) onSelect(preselected);
  }, [clinics.data, preselectedId, onSelect]);

  return (
    <AsyncContent {...clinics} onRetry={clinics.reload} emptyMessage="لا توجد عيادات متاحة للحجز حاليًا">
      {(items) => (
        <div className="grid gap-3 sm:grid-cols-2">
          {items.map((clinic) => (
            <ChoiceChip
              key={clinic.id}
              onClick={() => onSelect(clinic)}
              className="flex-col items-start gap-1.5 p-4 text-start"
            >
              <span className="flex items-center gap-2 text-base text-brand-900">
                <Icon name="building" className="size-5 text-brand-600" />
                {clinic.name}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {clinic.city} – {clinic.address}
              </span>
            </ChoiceChip>
          ))}
        </div>
      )}
    </AsyncContent>
  );
};
