import { CAIRO_TIME_ZONE, DISPLAY_LOCALE } from '../config/constants.js';

const KNOWN_SUNDAY = Date.UTC(2023, 0, 1);
const DAY_MS = 86_400_000;

const cairoFormatter = (options) => new Intl.DateTimeFormat(DISPLAY_LOCALE, { timeZone: CAIRO_TIME_ZONE, ...options });

const dateFormatters = {
  long: cairoFormatter({ weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
  medium: cairoFormatter({ weekday: 'long', day: 'numeric', month: 'long' }),
  short: cairoFormatter({ day: 'numeric', month: 'short' }),
  weekday: cairoFormatter({ weekday: 'short' }),
};

const clockFormatter = new Intl.DateTimeFormat(DISPLAY_LOCALE, { hour: 'numeric', minute: '2-digit', timeZone: 'UTC' });
const weekdayNameFormatter = new Intl.DateTimeFormat(DISPLAY_LOCALE, { weekday: 'long', timeZone: 'UTC' });
const isoDateFormatter = new Intl.DateTimeFormat('en-CA', { timeZone: CAIRO_TIME_ZONE });

// Midday UTC falls on the same calendar day in Cairo all year round.
const fromDateOnly = (date) => new Date(`${date}T12:00:00Z`);

export const formatDate = (date, style = 'long') => dateFormatters[style].format(fromDateOnly(date));

export const formatTime = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  return clockFormatter.format(new Date(Date.UTC(2000, 0, 1, hours, minutes)));
};

export const formatTimeRange = ({ startTime, endTime }) => `${formatTime(startTime)} – ${formatTime(endTime)}`;

export const getWeekdayName = (dayOfWeek) => weekdayNameFormatter.format(new Date(KNOWN_SUNDAY + dayOfWeek * DAY_MS));

export const todayInCairo = () => isoDateFormatter.format(new Date());
