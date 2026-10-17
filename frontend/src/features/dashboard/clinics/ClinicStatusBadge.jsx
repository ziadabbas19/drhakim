import { useI18n } from '../../../hooks/useI18n.js';
import { ActiveBadge } from '../ActiveControls.jsx';

export const ClinicStatusBadge = ({ isActive }) => {
  const { t } = useI18n();
  return <ActiveBadge isActive={isActive} activeLabel={t('dashboard.clinics.acceptingBookings')} />;
};
