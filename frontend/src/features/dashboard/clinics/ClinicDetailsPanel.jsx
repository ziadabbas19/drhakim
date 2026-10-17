import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { dashboardApi } from '../../../api/dashboard.js';
import { AsyncContent } from '../../../components/AsyncContent.jsx';
import { Button } from '../../../components/Button.jsx';
import { Card } from '../../../components/Card.jsx';
import { CardHeader } from '../../../components/CardHeader.jsx';
import { dashboardPath } from '../../../config/navigation.js';
import { PERMISSIONS } from '../../../config/permissions.js';
import { useAuth } from '../../../hooks/useAuth.js';
import { useFetch } from '../../../hooks/useFetch.js';
import { WeeklySchedule } from '../../clinics/WeeklySchedule.jsx';
import { AffectedBookingsNotice } from '../AffectedBookingsNotice.jsx';
import { PanelHeader } from '../PanelHeader.jsx';
import { ClinicStatusBadge } from './ClinicStatusBadge.jsx';
import { DaysOffManager } from './DaysOffManager.jsx';
import { ScheduleEditor } from './ScheduleEditor.jsx';

export const ClinicDetailsPanel = () => {
  const { clinicId } = useParams();
  const { can } = useAuth();
  const canManage = can(PERMISSIONS.CLINICS_MANAGE);
  const clinic = useFetch(() => dashboardApi.clinics.get(clinicId), [clinicId]);
  const [affectedBookings, setAffectedBookings] = useState([]);

  const handleScheduleSaved = ({ data }) => {
    clinic.setData(data.clinic);
    setAffectedBookings(data.affectedBookings);
  };

  return (
    <>
      <PanelHeader
        title={clinic.data?.name ?? 'تفاصيل العيادة'}
        description="مواعيد العمل الأسبوعية والإجازات الخاصة بهذه العيادة."
        actions={
          <Button as={Link} to={dashboardPath('clinics')} variant="secondary" icon="arrowBack">
            كل العيادات
          </Button>
        }
      />
      <AsyncContent {...clinic} onRetry={clinic.reload}>
        {(data) => (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
              <ClinicStatusBadge isActive={data.isActive} />
              <span>{data.city}</span>
              <span aria-hidden="true">·</span>
              <span>{data.address}</span>
            </div>
            <AffectedBookingsNotice bookings={affectedBookings} onDismiss={() => setAffectedBookings([])} />
            <Card className="space-y-5">
              <CardHeader
                title="مواعيد العمل الأسبوعية"
                description={
                  canManage &&
                  'يمكنك إضافة أكثر من فترة في اليوم، مثل فترة صباحية وأخرى مسائية. تغيير المواعيد لا يعدّل الحجوزات المسجلة.'
                }
              />
              {canManage ? (
                <ScheduleEditor clinic={data} onSaved={handleScheduleSaved} />
              ) : (
                <WeeklySchedule schedules={data.schedules} />
              )}
            </Card>
            <DaysOffManager clinicId={data.id} canManage={canManage} onAffectedBookings={setAffectedBookings} />
          </div>
        )}
      </AsyncContent>
    </>
  );
};
