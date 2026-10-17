import { useState } from 'react';
import { Link } from 'react-router';
import { dashboardApi } from '../../../api/dashboard.js';
import { Button } from '../../../components/Button.jsx';
import { Ltr } from '../../../components/Ltr.jsx';
import { dashboardPath } from '../../../config/navigation.js';
import { PERMISSIONS } from '../../../config/permissions.js';
import { useAuth } from '../../../hooks/useAuth.js';
import { useFormat } from '../../../hooks/useFormat.js';
import { useI18n } from '../../../hooks/useI18n.js';
import { usePaginatedList } from '../../../hooks/usePaginatedList.js';
import { groupSchedulesByDay } from '../../clinics/schedule.js';
import { ActiveToggleButton } from '../ActiveControls.jsx';
import { AffectedBookingsNotice } from '../AffectedBookingsNotice.jsx';
import { PaginatedTable } from '../PaginatedTable.jsx';
import { PanelHeader } from '../PanelHeader.jsx';
import { EditButton, RowActions } from '../RowActions.jsx';
import { useActiveToggle } from '../useActiveToggle.js';
import { useRecordModal } from '../useRecordModal.js';
import { ClinicFormModal } from './ClinicFormModal.jsx';
import { ClinicStatusBadge } from './ClinicStatusBadge.jsx';

export const ClinicsPanel = () => {
  const { t, pick } = useI18n();
  const format = useFormat();
  const { can } = useAuth();
  const canManage = can(PERMISSIONS.CLINICS_MANAGE);
  const clinics = usePaginatedList(dashboardApi.clinics.list);
  const [affectedBookings, setAffectedBookings] = useState([]);

  const describeWorkingDays = (schedules) =>
    groupSchedulesByDay(schedules)
      .filter(({ ranges }) => ranges.length)
      .map(({ dayOfWeek }) => format.weekday(dayOfWeek))
      .join(t('common.listSeparator')) || t('dashboard.clinics.noWorkingDays');

  const handleSaved = ({ data }) => {
    setAffectedBookings(data.affectedBookings);
    clinics.reload();
  };
  const clinicModal = useRecordModal(handleSaved);

  const toggleActive = useActiveToggle({
    update: dashboardApi.clinics.update,
    describeDeactivation: (clinic) => ({
      title: t('dashboard.clinics.deactivate.title'),
      message: t('dashboard.clinics.deactivate.message', { name: pick(clinic, 'name') }),
    }),
    onSuccess: handleSaved,
  });

  const columns = [
    {
      key: 'name',
      header: t('dashboard.clinics.columns.clinic'),
      render: (clinic) => (
        <div>
          <p className="font-bold text-ink-strong">{pick(clinic, 'name')}</p>
          <p className="text-xs text-ink-subtle">{pick(clinic, 'city')}</p>
        </div>
      ),
    },
    { key: 'phone', header: t('dashboard.clinics.columns.phone'), render: (clinic) => <Ltr>{clinic.phone}</Ltr> },
    {
      key: 'slot',
      header: t('dashboard.clinics.columns.slot'),
      render: (clinic) => t('common.minutes', { count: clinic.slotDurationMinutes }),
    },
    {
      key: 'days',
      header: t('dashboard.clinics.columns.days'),
      render: (clinic) => describeWorkingDays(clinic.schedules),
    },
    {
      key: 'status',
      header: t('dashboard.clinics.columns.status'),
      render: (clinic) => <ClinicStatusBadge isActive={clinic.isActive} />,
    },
    {
      key: 'actions',
      header: '',
      render: (clinic) => (
        <RowActions>
          <Button as={Link} to={dashboardPath('clinics', clinic.id)} variant="secondary" size="sm" icon="calendar">
            {t('dashboard.clinics.scheduleLink')}
          </Button>
          {canManage && (
            <>
              <EditButton onClick={() => clinicModal.open(clinic)} />
              <ActiveToggleButton isActive={clinic.isActive} onClick={() => toggleActive(clinic)} />
            </>
          )}
        </RowActions>
      ),
    },
  ];

  return (
    <>
      <PanelHeader
        title={t('dashboard.clinics.title')}
        description={t('dashboard.clinics.description')}
        actions={
          canManage && (
            <Button icon="plus" onClick={() => clinicModal.open()}>
              {t('dashboard.clinics.add')}
            </Button>
          )
        }
      />
      <div className="space-y-5">
        <AffectedBookingsNotice bookings={affectedBookings} onDismiss={() => setAffectedBookings([])} />
        <PaginatedTable list={clinics} columns={columns} emptyMessage={t('dashboard.clinics.empty')} />
      </div>
      {clinicModal.isOpen && (
        <ClinicFormModal clinic={clinicModal.record} onClose={clinicModal.close} onSaved={clinicModal.handleSaved} />
      )}
    </>
  );
};
