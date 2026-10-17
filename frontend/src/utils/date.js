import { CAIRO_TIME_ZONE } from '../config/constants.js';

const KNOWN_SUNDAY = Date.UTC(2023, 0, 1);
const DAY_MS = 86_400_000;

const isoDateFormatter = new Intl.DateTimeFormat('en-CA', { timeZone: CAIRO_TIME_ZONE });

// Midday UTC falls on the same calendar day in Cairo all year round.
const fromDateOnly = (date) => new Date(`${date}T12:00:00Z`);

const fromTime = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  return new Date(Date.UTC(2000, 0, 1, hours, minutes));
};

const DATE_STYLES = Object.freeze({
  long: { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' },
  medium: { weekday: 'long', day: 'numeric', month: 'long' },
  short: { day: 'numeric', month: 'short' },
  day: { day: 'numeric', month: 'long', year: 'numeric' },
  weekday: { weekday: 'short' },
});

const buildFormatters = (locale) => {
  const dates = Object.fromEntries(
    Object.entries(DATE_STYLES).map(([style, options]) => [
      style,
      new Intl.DateTimeFormat(locale, { timeZone: CAIRO_TIME_ZONE, ...options }),
    ]),
  );
  const clock = new Intl.DateTimeFormat(locale, { hour: 'numeric', minute: '2-digit', timeZone: 'UTC' });
  const weekday = new Intl.DateTimeFormat(locale, { weekday: 'long', timeZone: 'UTC' });
  const numbers = new Intl.NumberFormat(locale);
  const time = (value) => clock.format(fromTime(value));

  return {
    date: (value, style = 'long') => dates[style].format(fromDateOnly(value)),
    // A moment such as createdAt, shown as its date in Cairo.
    dateOf: (timestamp, style = 'day') => dates[style].format(new Date(timestamp)),
    time,
    timeRange: ({ startTime, endTime }) => `${time(startTime)} – ${time(endTime)}`,
    weekday: (dayOfWeek) => weekday.format(new Date(KNOWN_SUNDAY + dayOfWeek * DAY_MS)),
    number: (value) => numbers.format(value),
  };
};

const formattersByLocale = new Map();

export const getFormatters = (locale) => {
  if (!formattersByLocale.has(locale)) formattersByLocale.set(locale, buildFormatters(locale));
  return formattersByLocale.get(locale);
};

export const todayInCairo = () => isoDateFormatter.format(new Date());
