import { CAIRO_TIME_ZONE } from '../config/constants.js';

const MINUTES_PER_HOUR = 60;
const KNOWN_SUNDAY = Date.UTC(2023, 0, 1);

const cairoClock = new Intl.DateTimeFormat('en-CA', {
  timeZone: CAIRO_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

const weekdayFormatter = new Intl.DateTimeFormat('ar-EG', { weekday: 'long', timeZone: 'UTC' });

const parseDate = (date) => new Date(`${date}T00:00:00Z`);

export const nowInCairo = () => {
  const parts = Object.fromEntries(
    cairoClock.formatToParts(new Date()).map(({ type, value }) => [type, value]),
  );
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    time: `${parts.hour}:${parts.minute}`,
  };
};

export const isValidDate = (date) => {
  const parsed = parseDate(date);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().startsWith(date);
};

export const addDays = (date, days) => {
  const result = parseDate(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result.toISOString().slice(0, 10);
};

export const getDayOfWeek = (date) => parseDate(date).getUTCDay();

export const getWeekdayName = (dayOfWeek) =>
  weekdayFormatter.format(new Date(KNOWN_SUNDAY + Number(dayOfWeek) * 86_400_000));

export const toMinutes = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * MINUTES_PER_HOUR + minutes;
};

export const fromMinutes = (totalMinutes) =>
  [Math.floor(totalMinutes / MINUTES_PER_HOUR), totalMinutes % MINUTES_PER_HOUR]
    .map((part) => String(part).padStart(2, '0'))
    .join(':');

export const compareByStartTime = (first, second) => toMinutes(first.startTime) - toMinutes(second.startTime);

export const isUpcoming = ({ date, time }, now) =>
  date > now.date || (date === now.date && time > now.time);
