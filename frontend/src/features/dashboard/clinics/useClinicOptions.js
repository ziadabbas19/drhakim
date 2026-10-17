import { dashboardApi } from '../../../api/dashboard.js';
import { MAX_PAGE_SIZE } from '../../../config/constants.js';
import { useFetch } from '../../../hooks/useFetch.js';
import { useI18n } from '../../../hooks/useI18n.js';
import { clinicLabel } from '../../clinics/clinicLabel.js';

export const useClinicOptions = () => {
  const { pick } = useI18n();
  const { data } = useFetch(() => dashboardApi.clinics.list({ limit: MAX_PAGE_SIZE }), []);
  return (data?.items ?? []).map((clinic) => ({
    value: clinic.id,
    label: clinicLabel({ name: pick(clinic, 'name'), city: pick(clinic, 'city') }),
  }));
};
