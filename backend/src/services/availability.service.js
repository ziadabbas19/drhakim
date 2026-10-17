import { Op } from 'sequelize';
import { BOOKING_STATUSES, BOOKING_WINDOW_DAYS, UPCOMING_BOOKING_STATUSES } from '../config/constants.js';
import { messages } from '../i18n/index.js';
import { Booking, Clinic } from '../models/index.js';
import { ApiError } from '../utils/ApiError.js';
import {
  addDays,
  compareByStartTime,
  fromMinutes,
  getDayOfWeek,
  isUpcoming,
  nowInCairo,
  toMinutes,
} from '../utils/date.js';

const buildSlotTimes = (ranges, slotDuration) =>
  ranges
    .toSorted(compareByStartTime)
    .flatMap(({ startTime, endTime }) => {
      const times = [];
      for (let start = toMinutes(startTime); start + slotDuration <= toMinutes(endTime); start += slotDuration) {
        times.push(fromMinutes(start));
      }
      return times;
    });

const getBookingWindow = (today) =>
  Array.from({ length: BOOKING_WINDOW_DAYS + 1 }, (_, offset) => addDays(today, offset));

const isInBookingWindow = (date, today) => date >= today && date <= addDays(today, BOOKING_WINDOW_DAYS);

const dateRangeWhere = ({ from, to }) => (to ? { [Op.between]: [from, to] } : { [Op.gte]: from });

const loadClinicCalendar = async (where, range) => {
  const clinic = await Clinic.findOne({
    where,
    include: ['schedules', { association: 'daysOff', where: { date: dateRangeWhere(range) }, required: false }],
  });
  if (!clinic) throw ApiError.notFound(messages.clinic.notFound);
  return clinic;
};

const getBookedTimesByDate = async (clinicId, range) => {
  const bookings = await Booking.findAll({
    attributes: ['date', 'time'],
    where: { clinicId, date: dateRangeWhere(range), status: { [Op.ne]: BOOKING_STATUSES.CANCELLED } },
  });
  return bookings.reduce(
    (bookedTimes, { date, time }) => bookedTimes.set(date, (bookedTimes.get(date) ?? new Set()).add(time)),
    new Map(),
  );
};

const getOfferedTimes = (clinic, date) => {
  if (clinic.daysOff.some((dayOff) => dayOff.date === date)) return [];
  const dayOfWeek = getDayOfWeek(date);
  const ranges = clinic.schedules.filter((range) => range.dayOfWeek === dayOfWeek);
  return buildSlotTimes(ranges, clinic.slotDurationMinutes);
};

const buildDaySlots = (clinic, date, bookedTimes = new Set(), now) =>
  getOfferedTimes(clinic, date)
    .filter((time) => isUpcoming({ date, time }, now))
    .map((time) => ({ time, isBooked: bookedTimes.has(time) }));

export const getAvailableDates = async (clinicId) => {
  const now = nowInCairo();
  const dates = getBookingWindow(now.date);
  const range = { from: dates[0], to: dates.at(-1) };
  const [clinic, bookedTimes] = await Promise.all([
    loadClinicCalendar({ id: clinicId, isActive: true }, range),
    getBookedTimesByDate(clinicId, range),
  ]);

  return dates
    .map((date) => ({ date, slots: buildDaySlots(clinic, date, bookedTimes.get(date), now) }))
    .filter(({ slots }) => slots.length > 0)
    .map(({ date, slots }) => ({ date, freeSlots: slots.filter((slot) => !slot.isBooked).length }));
};

export const getDaySlots = async (clinicId, date) => {
  const now = nowInCairo();
  const range = { from: date, to: date };
  const clinic = await loadClinicCalendar({ id: clinicId, isActive: true }, range);
  if (!isInBookingWindow(date, now.date)) return [];

  const bookedTimes = await getBookedTimesByDate(clinicId, range);
  return buildDaySlots(clinic, date, bookedTimes.get(date), now);
};

export const assertSlotAvailable = async (clinicId, date, time) => {
  const slot = (await getDaySlots(clinicId, date)).find((daySlot) => daySlot.time === time);
  if (!slot) throw ApiError.badRequest(messages.booking.slotUnavailable);
  if (slot.isBooked) throw ApiError.conflict(messages.booking.slotTaken);
};

export const findAffectedBookings = async (clinicId) => {
  const now = nowInCairo();
  const [clinic, bookings] = await Promise.all([
    loadClinicCalendar({ id: clinicId }, { from: now.date }),
    Booking.findAll({
      where: { clinicId, status: UPCOMING_BOOKING_STATUSES, date: { [Op.gte]: now.date } },
      order: [
        ['date', 'ASC'],
        ['time', 'ASC'],
      ],
    }),
  ]);

  const stillOffered = (booking) => clinic.isActive && getOfferedTimes(clinic, booking.date).includes(booking.time);
  return bookings.filter((booking) => isUpcoming(booking, now) && !stillOffered(booking));
};
