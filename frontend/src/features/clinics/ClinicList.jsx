import { publicApi } from '../../api/public.js';
import { AsyncContent } from '../../components/AsyncContent.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { ClinicCard } from './ClinicCard.jsx';

export const ClinicList = ({ showSchedule = true }) => {
  const clinics = useFetch(publicApi.clinics.list, []);

  return (
    <AsyncContent {...clinics} onRetry={clinics.reload} emptyMessage="لا توجد عيادات متاحة حاليًا">
      {(items) => (
        <div className="grid gap-6 md:grid-cols-2">
          {items.map((clinic) => (
            <ClinicCard key={clinic.id} clinic={clinic} showSchedule={showSchedule} />
          ))}
        </div>
      )}
    </AsyncContent>
  );
};
