import { dashboardApi } from '../../../api/dashboard.js';
import { AsyncContent } from '../../../components/AsyncContent.jsx';
import { Badge } from '../../../components/Badge.jsx';
import { Button } from '../../../components/Button.jsx';
import { Card } from '../../../components/Card.jsx';
import { CardHeader } from '../../../components/CardHeader.jsx';
import { DataTable } from '../../../components/DataTable.jsx';
import { Form } from '../../../components/Form.jsx';
import { FormField } from '../../../components/FormField.jsx';
import { OPTION_GROUPS } from '../../../config/constants.js';
import { useAction } from '../../../hooks/useAction.js';
import { useFetch } from '../../../hooks/useFetch.js';
import { useFormat } from '../../../hooks/useFormat.js';
import { useI18n } from '../../../hooks/useI18n.js';
import { useOptionLabel, useOptions } from '../../../hooks/useOptions.js';
import { useSubmitForm } from '../../../hooks/useSubmitForm.js';
import { todayInCairo } from '../../../utils/date.js';
import { dayOffSchema } from '../../../validators/clinic.js';
import { DeleteButton, RowActions } from '../RowActions.jsx';

const EMPTY_DAY_OFF = { date: '', reason: OPTION_GROUPS.dayOffReason[0] };

export const DaysOffManager = ({ clinicId, canManage, onAffectedBookings }) => {
  const { t } = useI18n();
  const format = useFormat();
  const reasonOptions = useOptions('dayOffReason');
  const optionLabel = useOptionLabel();
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
        title: t('dashboard.daysOff.remove.title'),
        message: t('dashboard.daysOff.remove.message', { date: format.date(dayOff.date) }),
        confirmLabel: t('common.delete'),
      },
      onSuccess: handleChanged,
    });

  const columns = [
    {
      key: 'date',
      header: t('dashboard.daysOff.date'),
      render: (dayOff) => <span className="font-bold">{format.date(dayOff.date)}</span>,
    },
    {
      key: 'reason',
      header: t('dashboard.daysOff.reason'),
      render: (dayOff) => <Badge tone="brand">{optionLabel('dayOffReason', dayOff.reason)}</Badge>,
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
      <CardHeader title={t('dashboard.daysOff.title')} description={t('dashboard.daysOff.description')} />

      {canManage && (
        <Form
          form={form}
          className="grid gap-3 rounded-xl bg-surface-muted p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-start"
        >
          <FormField
            label={t('dashboard.daysOff.date')}
            type="date"
            min={todayInCairo()}
            required
            {...form.register('date')}
          />
          <FormField
            label={t('dashboard.daysOff.reason')}
            as="select"
            options={reasonOptions}
            required
            {...form.register('reason')}
          />
          <Button type="submit" icon="calendarOff" isLoading={form.isSubmitting} className="sm:mt-7">
            {t('dashboard.daysOff.add')}
          </Button>
        </Form>
      )}

      <AsyncContent {...daysOff} onRetry={daysOff.reload} emptyMessage={t('dashboard.daysOff.empty')}>
        {(items) => <DataTable columns={columns} rows={items} isRefreshing={daysOff.isLoading} />}
      </AsyncContent>
    </Card>
  );
};
