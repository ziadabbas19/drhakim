import { Op } from 'sequelize';
import { messages } from '../config/messages.js';
import { ClinicDayOff } from '../models/index.js';
import { ApiError } from '../utils/ApiError.js';
import { nowInCairo } from '../utils/date.js';
import { clinicService, withAffectedBookings } from './clinic.service.js';

export const dayOffService = {
  async list(clinicId) {
    await clinicService.findById(clinicId);
    return ClinicDayOff.findAll({
      where: { clinicId, date: { [Op.gte]: nowInCairo().date } },
      order: [['date', 'ASC']],
    });
  },

  async add(clinicId, { date, reason }) {
    await clinicService.findById(clinicId);
    if (date < nowInCairo().date) throw ApiError.badRequest(messages.dayOff.pastDate);

    const dayOff = await ClinicDayOff.create({ clinicId, date, reason });
    return withAffectedBookings(clinicId, { dayOff });
  },

  async remove(clinicId, dayOffId) {
    const removed = await ClinicDayOff.destroy({ where: { id: dayOffId, clinicId } });
    if (!removed) throw ApiError.notFound();
    return withAffectedBookings(clinicId);
  },
};
