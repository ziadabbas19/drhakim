import { formatTimeRange, getWeekdayName } from '../../utils/date.js';
import { groupSchedulesByDay } from './schedule.js';

export const WeeklySchedule = ({ schedules }) => {
  const workingDays = groupSchedulesByDay(schedules).filter(({ ranges }) => ranges.length > 0);

  if (!workingDays.length) {
    return <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500">لم تُحدَّد مواعيد العمل بعد.</p>;
  }

  return (
    <dl className="divide-y divide-slate-200/70 rounded-xl bg-slate-50 px-4">
      {workingDays.map(({ dayOfWeek, ranges }) => (
        <div key={dayOfWeek} className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-sm">
          <dt className="font-bold text-slate-700">{getWeekdayName(dayOfWeek)}</dt>
          <dd className="flex flex-wrap gap-1.5">
            {ranges.map((range) => (
              <span key={`${range.startTime}-${range.endTime}`} className="rounded-lg bg-white px-2 py-0.5 text-slate-600 shadow-xs">
                {formatTimeRange(range)}
              </span>
            ))}
          </dd>
        </div>
      ))}
    </dl>
  );
};
