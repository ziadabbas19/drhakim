import { getAvailableDates } from '../services/availability.service.js';
import { clinicService } from '../services/clinic.service.js';
import { dayOffService } from '../services/dayOff.service.js';
import { replaceSchedule } from '../services/schedule.service.js';
import { RESPONSES, respond } from '../utils/response.js';
import { createCrudController } from './crud.controller.js';

export const clinicController = {
  ...createCrudController(clinicService),
  availableDates: respond((req) => getAvailableDates(req.params.id)),
  replaceSchedule: respond((req) => replaceSchedule(req.params.id, req.body.ranges), RESPONSES.saved),
  listDaysOff: respond((req) => dayOffService.list(req.params.id)),
  addDayOff: respond((req) => dayOffService.add(req.params.id, req.body), RESPONSES.created),
  removeDayOff: respond((req) => dayOffService.remove(req.params.id, req.params.dayOffId), RESPONSES.deleted),
};
