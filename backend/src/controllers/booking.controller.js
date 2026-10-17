import { messages } from '../config/messages.js';
import { getDaySlots } from '../services/availability.service.js';
import { bookingService } from '../services/booking.service.js';
import { respond } from '../utils/response.js';
import { createCrudController } from './crud.controller.js';

export const bookingController = {
  ...createCrudController(bookingService),
  create: respond((req) => bookingService.create(req.body), { status: 201, message: messages.booking.created }),
  slots: respond((req) => getDaySlots(req.query.clinicId, req.query.date)),
};
