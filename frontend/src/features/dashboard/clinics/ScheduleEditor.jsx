import { dashboardApi } from '../../../api/dashboard.js';
import { Button } from '../../../components/Button.jsx';
import { Form } from '../../../components/Form.jsx';
import { Icon } from '../../../components/Icon.jsx';
import { WEEK_DAYS } from '../../../config/constants.js';
import { useFormat } from '../../../hooks/useFormat.js';
import { useI18n } from '../../../hooks/useI18n.js';
import { useSubmitForm } from '../../../hooks/useSubmitForm.js';
import { scheduleSchema } from '../../../validators/clinic.js';
import { TimeInput } from './TimeInput.jsx';

const NEW_RANGE = { startTime: '17:00', endTime: '21:00' };

const toRanges = (schedules) =>
  schedules.map(({ dayOfWeek, startTime, endTime }) => ({ dayOfWeek, startTime, endTime }));

export const ScheduleEditor = ({ clinic, onSaved }) => {
  const { t } = useI18n();
  const format = useFormat();
  const form = useSubmitForm({
    initialValues: { ranges: toRanges(clinic.schedules) },
    schema: scheduleSchema,
    submit: ({ ranges }) => dashboardApi.clinics.replaceSchedule(clinic.id, ranges),
    onSaved,
  });

  const { ranges } = form.values;
  const setRanges = (nextRanges) => form.setValue('ranges', nextRanges);
  const updateRange = (index, field, value) =>
    setRanges(ranges.map((range, position) => (position === index ? { ...range, [field]: value } : range)));
  const rangeError = (index) =>
    ['', '.startTime', '.endTime'].map((suffix) => form.errors[`ranges.${index}${suffix}`]).find(Boolean);

  return (
    <Form form={form} className="space-y-3">
      {WEEK_DAYS.map((dayOfWeek) => {
        const dayRanges = ranges
          .map((range, index) => ({ range, index }))
          .filter(({ range }) => range.dayOfWeek === dayOfWeek);

        return (
          <div
            key={dayOfWeek}
            role="group"
            aria-label={format.weekday(dayOfWeek)}
            className="flex flex-col gap-3 rounded-xl border border-line p-3 sm:flex-row sm:items-start"
          >
            <p className="w-24 shrink-0 pt-2 font-extrabold text-ink">{format.weekday(dayOfWeek)}</p>
            <div className="flex-1 space-y-2">
              {dayRanges.length === 0 && (
                <p className="pt-2 text-sm text-ink-subtle">{t('dashboard.schedule.noVisits')}</p>
              )}
              {dayRanges.map(({ range, index }) => (
                <div key={index} className="flex flex-wrap items-center gap-2">
                  <TimeInput
                    label={t('dashboard.schedule.from')}
                    value={range.startTime}
                    invalid={Boolean(rangeError(index))}
                    onChange={(value) => updateRange(index, 'startTime', value)}
                  />
                  <TimeInput
                    label={t('dashboard.schedule.to')}
                    value={range.endTime}
                    invalid={Boolean(rangeError(index))}
                    onChange={(value) => updateRange(index, 'endTime', value)}
                  />
                  <Button
                    variant="ghostDanger"
                    size="icon"
                    aria-label={t('dashboard.schedule.removeRange')}
                    onClick={() => setRanges(ranges.filter((_, position) => position !== index))}
                  >
                    <Icon name="trash" />
                  </Button>
                  {rangeError(index) && (
                    <p className="w-full text-sm font-semibold text-danger-ink">{rangeError(index)}</p>
                  )}
                </div>
              ))}
            </div>
            <Button
              variant="secondary"
              size="sm"
              icon="plus"
              onClick={() => setRanges([...ranges, { dayOfWeek, ...NEW_RANGE }])}
            >
              {t('dashboard.schedule.addRange')}
            </Button>
          </div>
        );
      })}
      <Button type="submit" icon="check" isLoading={form.isSubmitting}>
        {t('dashboard.schedule.save')}
      </Button>
    </Form>
  );
};
