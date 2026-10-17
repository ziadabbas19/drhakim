import { Clinic } from '../models/index.js';
import { findAffectedBookings } from './availability.service.js';
import { SORTABLE_ORDER, createCrudService } from './crud.service.js';

const crud = createCrudService(Clinic, {
  sortable: true,
  include: ['schedules'],
  order: [...SORTABLE_ORDER, ['schedules', 'dayOfWeek', 'ASC'], ['schedules', 'startTime', 'ASC']],
});

// Every change to a clinic's availability reports the upcoming bookings that no longer fit.
export const withAffectedBookings = async (clinicId, result = {}) => ({
  ...result,
  affectedBookings: await findAffectedBookings(clinicId),
});

export const clinicService = {
  ...crud,

  async create(data) {
    return { clinic: await crud.create(data), affectedBookings: [] };
  },

  async update(id, data) {
    return withAffectedBookings(id, { clinic: await crud.update(id, data) });
  },
};
