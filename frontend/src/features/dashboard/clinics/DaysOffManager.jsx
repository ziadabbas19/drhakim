import { dashboardApi } from '../../../api/dashboard.js';
import { AsyncContent } from '../../../components/AsyncContent.jsx';
import { Badge } from '../../../components/Badge.jsx';
import { Button } from '../../../components/Button.jsx';
import { Card } from '../../../components/Card.jsx';
import { CardHeader } from '../../../components/CardHeader.jsx';
import { DataTable } from '../../../components/DataTable.jsx';
import { Form } from '../../../components/Form.jsx';
import { FormField } from '../../../components/FormField.jsx';
import { DAY_OFF_REASON_OPTIONS, findOption } from '../../../config/constants.js';
import { useAction } from '../../../hooks/useAction.js';
import { useFetch } from '../../../hooks/useFetch.js';
import { useSubmitForm } from '../../../hooks/useSubmitForm.js';
import { formatDate, todayInCairo } from '../../../utils/date.js';
import { dayOffSchema } from '../../../validators/clinic.js';
import { DeleteButton, RowActions } from '../RowActions.jsx';

const EMPTY_DAY_OFF = { date: '', reason: DAY_OFF_REASON_OPTIONS[0].value };

export const DaysOffManager = ({ clinicId, canManage, onAffectedBookings }) => {
  const run = useAction();
  const daysOff = useFetch(() => dashboardApi.clinics.listDaysOff(clinicId), [clinicId]);

  const handleChanged = ({ data }) => {
    onAffectedBookings(data.affectedBookings);
    daysOff.reload();
  };

  const form = useSubmitForm({
    initialValues: EMPTY_DAY_OFF,
    schema: dayOffSchema,
    submit: (dayOff) => dashboardApi.clinics.addDayOff(clinicId, dayOff),
    onSaved: (response) => {
      form.reset();
      handleChanged(response);
    },
  });

  const remove = (dayOff) =>
    run(() => dashboardApi.clinics.removeDayOff(clinicId, dayOff.id), {
      confirmation: {
        title: 'حذف الإجازة',
        message: `سيصبح يوم ${formatDate(dayOff.date)} متاحًا للحجز مرة أخرى حسب مواعيد العمل. هل تريد المتابعة؟`,
        confirmLabel: 'حذف',
      },
      onSuccess: handleChanged,
    });

  const columns = [
    { key: 'date', header: 'اليوم', render: (dayOff) => <span className="font-bold">{formatDate(dayOff.date)}</span> },
    {
      key: 'reason',
      header: 'السبب',
      render: (dayOff) => <Badge tone="brand">{findOption(DAY_OFF_REASON_OPTIONS, dayOff.reason).label}</Badge>,
    },
    ...(canManage
      ? [
          {
            key: 'actions',
            header: '',
            render: (dayOff) => (
              <RowActions>
                <DeleteButton onClick={() => remove(dayOff)} />
              </RowActions>
            ),
          },
        ]
      : []),
  ];

  return (
    <Card className="space-y-5">
      <CardHeader
        title="الإجازات وأيام العمليات"
        description="الأيام المسجلة هنا لا تظهر للمرضى عند الحجز في هذه العيادة."
      />

      {canManage && (
        <Form form={form} className="grid gap-3 rounded-xl bg-slate-50 p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-start">
          <FormField label="التاريخ" type="date" min={todayInCairo()} required {...form.register('date')} />
          <FormField label="السبب" as="select" options={DAY_OFF_REASON_OPTIONS} required {...form.register('reason')} />
          <Button type="submit" icon="calendarOff" isLoading={form.isSubmitting} className="sm:mt-7">
            إضافة
          </Button>
        </Form>
      )}

      <AsyncContent {...daysOff} onRetry={daysOff.reload} emptyMessage="لا توجد إجازات قادمة مسجلة">
        {(items) => <DataTable columns={columns} rows={items} isRefreshing={daysOff.isLoading} />}
      </AsyncContent>
    </Card>
  );
};
