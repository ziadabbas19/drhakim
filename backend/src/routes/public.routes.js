import { Router } from 'express';
import { bookingController } from '../controllers/booking.controller.js';
import { clinicController } from '../controllers/clinic.controller.js';
import { serviceController } from '../controllers/service.controller.js';
import { settingController } from '../controllers/setting.controller.js';
import { bookingLimiter } from '../middlewares/rateLimiters.js';
import { validate, validateIdParam } from '../middlewares/validate.js';
import { createBookingSchema, slotsQuerySchema } from '../validators/booking.validator.js';

const router = Router();

router.get('/clinics', clinicController.listActive);
router.get('/clinics/:id/available-dates', validateIdParam, clinicController.availableDates);
router.get('/bookings/slots', validate(slotsQuerySchema, 'query'), bookingController.slots);
router.post('/bookings', bookingLimiter, validate(createBookingSchema), bookingController.create);
router.get('/services', serviceController.listActive);
router.get('/settings', settingController.get);

export default router;
