import { dashboardApi } from '../../../api/dashboard.js';
import { MAX_PAGE_SIZE } from '../../../config/constants.js';
import { useFetch } from '../../../hooks/useFetch.js';
import { clinicLabel } from '../../clinics/clinicLabel.js';

export const useClinicOptions = () => {
  const { data } = useFetch(() => dashboardApi.clinics.list({ limit: MAX_PAGE_SIZE }), []);
  return (data?.items ?? []).map((clinic) => ({ value: clinic.id, label: clinicLabel(clinic) }));
};
