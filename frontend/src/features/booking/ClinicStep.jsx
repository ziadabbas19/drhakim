import { useEffect } from 'react';
import { Icon } from '../../components/Icon.jsx';
import { Stagger } from '../../motion/Stagger.jsx';
import { ChoiceChip } from './ChoiceChip.jsx';

// `clinics` are the clinics taking online bookings.
export const ClinicStep = ({ clinics, preselectedId, onSelect }) => {
  useEffect(() => {
    const preselected = clinics.find((clinic) => clinic.id === preselectedId);
    if (preselected) onSelect(preselected);
  }, [clinics, preselectedId, onSelect]);

  return (
    <Stagger className="grid gap-3 sm:grid-cols-2">
      {clinics.map((clinic) => (
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
  );
};
