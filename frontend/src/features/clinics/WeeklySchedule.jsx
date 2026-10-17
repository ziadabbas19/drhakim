import { useFormat } from '../../hooks/useFormat.js';
import { useI18n } from '../../hooks/useI18n.js';
import { groupSchedulesByDay } from './schedule.js';

export const WeeklySchedule = ({ schedules }) => {
  const { t } = useI18n();
  const format = useFormat();
  const workingDays = groupSchedulesByDay(schedules).filter(({ ranges }) => ranges.length > 0);

  if (!workingDays.length) {
    return <p className="rounded-xl bg-surface-muted px-4 py-3 text-sm text-ink-subtle">{t('clinics.noSchedule')}</p>;
  }

  return (
    <dl className="divide-y divide-line rounded-xl bg-surface-muted px-4">
      {workingDays.map(({ dayOfWeek, ranges }) => (
        <div key={dayOfWeek} className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-sm">
          <dt className="font-bold text-ink">{format.weekday(dayOfWeek)}</dt>
          <dd className="flex flex-wrap gap-1.5">
            {ranges.map((range) => (
              <span
                key={`${range.startTime}-${range.endTime}`}
                className="rounded-lg bg-surface px-2 py-0.5 text-ink-muted shadow-xs"
              >
                {format.timeRange(range)}
              </span>
            ))}
          </dd>
        </div>
      ))}
    </dl>
  );
};
