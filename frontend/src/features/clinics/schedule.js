import { WEEK_DAYS } from '../../config/constants.js';

const byStartTime = (first, second) => first.startTime.localeCompare(second.startTime);

export const groupSchedulesByDay = (schedules) =>
  WEEK_DAYS.map((dayOfWeek) => ({
    dayOfWeek,
    ranges: schedules.filter((range) => range.dayOfWeek === dayOfWeek).toSorted(byStartTime),
  }));
