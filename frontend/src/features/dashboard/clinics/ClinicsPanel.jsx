import { useState } from 'react';
import { Link } from 'react-router';
import { dashboardApi } from '../../../api/dashboard.js';
import { Button } from '../../../components/Button.jsx';
import { dashboardPath } from '../../../config/navigation.js';
import { PERMISSIONS } from '../../../config/permissions.js';
import { useAuth } from '../../../hooks/useAuth.js';
import { usePaginatedList } from '../../../hooks/usePaginatedList.js';
import { getWeekdayName } from '../../../utils/date.js';
import { formatNumber } from '../../../utils/number.js';
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

const describeWorkingDays = (schedules) =>
  groupSchedulesByDay(schedules)
    .filter(({ ranges }) => ranges.length)
    .map(({ dayOfWeek }) => getWeekdayName(dayOfWeek))
    .join('، ') || 'لم تُحدَّد';

export const ClinicsPanel = () => {
  const { can } = useAuth();
  const canManage = can(PERMISSIONS.CLINICS_MANAGE);
  const clinics = usePaginatedList(dashboardApi.clinics.list);
  const [affectedBookings, setAffectedBookings] = useState([]);

  const handleSaved = ({ data }) => {
    setAffectedBookings(data.affectedBookings);
    clinics.reload();
  };
  const clinicModal = useRecordModal(handleSaved);

  const toggleActive = useActiveToggle({
    update: dashboardApi.clinics.update,
    describeDeactivation: (clinic) => ({
      title: 'إيقاف العيادة',
      message: `سيتم إخفاء ${clinic.name} من الموقع ولن يتمكن المرضى من الحجز فيها. الحجوزات المسجلة لن تُحذف.`,
    }),
    onSuccess: handleSaved,
  });

  const columns = [
    {
      key: 'name',
      header: 'العيادة',
      render: (clinic) => (
        <div>
          <p className="font-bold text-slate-800">{clinic.name}</p>
          <p className="text-xs text-slate-500">{clinic.city}</p>
        </div>
      ),
    },
    { key: 'phone', header: 'الهاتف', render: (clinic) => <span dir="ltr">{clinic.phone}</span> },
    { key: 'slot', header: 'مدة الكشف', render: (clinic) => `${formatNumber(clinic.slotDurationMinutes)} دقيقة` },
    { key: 'days', header: 'أيام العمل', render: (clinic) => describeWorkingDays(clinic.schedules) },
    { key: 'status', header: 'الحالة', render: (clinic) => <ClinicStatusBadge isActive={clinic.isActive} /> },
    {
      key: 'actions',
      header: '',
      render: (clinic) => (
        <RowActions>
          <Button as={Link} to={dashboardPath('clinics', clinic.id)} variant="secondary" size="sm" icon="calendar">
            المواعيد والإجازات
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
        title="العيادات والمواعيد"
        description="بيانات العيادات ومواعيد العمل والإجازات التي تظهر للمرضى عند الحجز."
        actions={
          canManage && (
            <Button icon="plus" onClick={() => clinicModal.open()}>
              إضافة عيادة
            </Button>
          )
        }
      />
      <div className="space-y-5">
        <AffectedBookingsNotice bookings={affectedBookings} onDismiss={() => setAffectedBookings([])} />
        <PaginatedTable list={clinics} columns={columns} emptyMessage="لم تتم إضافة عيادات بعد" />
      </div>
      {clinicModal.isOpen && (
        <ClinicFormModal clinic={clinicModal.record} onClose={clinicModal.close} onSaved={clinicModal.handleSaved} />
      )}
    </>
  );
};
