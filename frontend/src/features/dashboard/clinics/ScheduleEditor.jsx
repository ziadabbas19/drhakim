import { dashboardApi } from '../../../api/dashboard.js';
import { Button } from '../../../components/Button.jsx';
import { Form } from '../../../components/Form.jsx';
import { Icon } from '../../../components/Icon.jsx';
import { WEEK_DAYS } from '../../../config/constants.js';
import { useSubmitForm } from '../../../hooks/useSubmitForm.js';
import { getWeekdayName } from '../../../utils/date.js';
import { scheduleSchema } from '../../../validators/clinic.js';
import { TimeInput } from './TimeInput.jsx';

const NEW_RANGE = { startTime: '17:00', endTime: '21:00' };

const toRanges = (schedules) => schedules.map(({ dayOfWeek, startTime, endTime }) => ({ dayOfWeek, startTime, endTime }));

export const ScheduleEditor = ({ clinic, onSaved }) => {
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
            aria-label={getWeekdayName(dayOfWeek)}
            className="flex flex-col gap-3 rounded-xl border border-slate-200 p-3 sm:flex-row sm:items-start"
          >
            <p className="w-24 shrink-0 pt-2 font-extrabold text-slate-700">{getWeekdayName(dayOfWeek)}</p>
            <div className="flex-1 space-y-2">
              {dayRanges.length === 0 && <p className="pt-2 text-sm text-slate-400">لا يوجد كشف</p>}
              {dayRanges.map(({ range, index }) => (
                <div key={index} className="flex flex-wrap items-center gap-2">
                  <TimeInput
                    label="من"
                    value={range.startTime}
                    invalid={Boolean(rangeError(index))}
                    onChange={(value) => updateRange(index, 'startTime', value)}
                  />
                  <TimeInput
                    label="إلى"
                    value={range.endTime}
                    invalid={Boolean(rangeError(index))}
                    onChange={(value) => updateRange(index, 'endTime', value)}
                  />
                  <Button
                    variant="ghostDanger"
                    size="icon"
                    aria-label="حذف الفترة"
                    onClick={() => setRanges(ranges.filter((_, position) => position !== index))}
                  >
                    <Icon name="trash" />
                  </Button>
                  {rangeError(index) && <p className="w-full text-sm font-semibold text-red-600">{rangeError(index)}</p>}
                </div>
              ))}
            </div>
            <Button
              variant="secondary"
              size="sm"
              icon="plus"
              onClick={() => setRanges([...ranges, { dayOfWeek, ...NEW_RANGE }])}
            >
              إضافة فترة
            </Button>
          </div>
        );
      })}
      <Button type="submit" icon="check" isLoading={form.isSubmitting}>
        حفظ مواعيد العمل
      </Button>
    </Form>
  );
};
