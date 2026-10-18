import { WEEK_DAYS } from '../../config/constants.js';
import { listOf } from '../../utils/shape.js';

const byStartTime = (first, second) => first.startTime.localeCompare(second.startTime);

export const groupSchedulesByDay = (schedules) =>
  WEEK_DAYS.map((dayOfWeek) => ({
    dayOfWeek,
    ranges: schedules.filter((range) => range.dayOfWeek === dayOfWeek).toSorted(byStartTime),
  }));

// A clinic takes online bookings once its weekly hours are published; until then patients call.
export const takesOnlineBookings = (clinic) => listOf(clinic?.schedules).length > 0;
