import { messages } from '../i18n/index.js';
import { ClinicSchedule, sequelize } from '../models/index.js';
import { ApiError } from '../utils/ApiError.js';
import { compareByStartTime, getWeekdayName, toMinutes } from '../utils/date.js';
import { clinicService, withAffectedBookings } from './clinic.service.js';

const assertNoOverlaps = (ranges) => {
  const rangesByDay = Object.groupBy(ranges, (range) => range.dayOfWeek);

  for (const [dayOfWeek, dayRanges] of Object.entries(rangesByDay)) {
    const sorted = dayRanges.toSorted(compareByStartTime);
    const overlaps = sorted.some(
      (range, index) => index > 0 && toMinutes(range.startTime) < toMinutes(sorted[index - 1].endTime),
    );
    if (overlaps) {
      const day = (lang) => getWeekdayName(dayOfWeek, lang);
      throw ApiError.badRequest(messages.clinic.scheduleOverlap, null, { day });
    }
  }
};

export const replaceSchedule = async (clinicId, ranges) => {
  await clinicService.findById(clinicId);
  assertNoOverlaps(ranges);

  await sequelize.transaction(async (transaction) => {
    await ClinicSchedule.destroy({ where: { clinicId }, transaction });
    await ClinicSchedule.bulkCreate(
      ranges.map((range) => ({ ...range, clinicId })),
      { transaction },
    );
  });

  return withAffectedBookings(clinicId, { clinic: await clinicService.findById(clinicId) });
};
