import { publicApi } from '../../api/public.js';
import { AsyncContent } from '../../components/AsyncContent.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { useI18n } from '../../hooks/useI18n.js';
import { Stagger } from '../../motion/Stagger.jsx';
import { ClinicCard } from './ClinicCard.jsx';

export const ClinicList = (cardProps) => {
  const { t } = useI18n();
  const clinics = useFetch(publicApi.clinics.list, []);

  return (
    <AsyncContent {...clinics} onRetry={clinics.reload} emptyMessage={t('clinics.empty')} reserveSpace>
      {(items) => (
        <Stagger className="grid gap-6 md:grid-cols-2">
          {items.map((clinic) => (
            <ClinicCard key={clinic.id} clinic={clinic} {...cardProps} />
          ))}
        </Stagger>
      )}
    </AsyncContent>
  );
};
