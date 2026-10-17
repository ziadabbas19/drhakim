import { Router } from 'express';
import { aboutController } from '../controllers/about.controller.js';
import { bookingController } from '../controllers/booking.controller.js';
import { clinicController } from '../controllers/clinic.controller.js';
import { reviewController } from '../controllers/review.controller.js';
import { serviceController } from '../controllers/service.controller.js';
import { settingController } from '../controllers/setting.controller.js';
import { cachePublic, noStore } from '../middlewares/cache.js';
import { localizeResponses } from '../middlewares/language.js';
import { bookingLimiter, reviewLimiter } from '../middlewares/rateLimiters.js';
import { validate, validateIdParam } from '../middlewares/validate.js';
import { createBookingSchema, slotsQuerySchema } from '../validators/booking.validator.js';
import { highlightsQuerySchema, publicReviewQuerySchema, submitReviewSchema } from '../validators/review.validator.js';

const router = Router();

// Public content is returned in the requested language and only when it is active.
router.use(localizeResponses);

router.get('/about', cachePublic, aboutController.getPublic);
router.get('/clinics', cachePublic, clinicController.listActive);
router.get('/services', cachePublic, serviceController.listActive);
router.get('/settings', cachePublic, settingController.get);

// Only approved reviews are ever returned; submissions wait for the doctor's approval.
router.get('/reviews', cachePublic, validate(publicReviewQuerySchema, 'query'), reviewController.listApproved);
router.get('/reviews/highlights', cachePublic, validate(highlightsQuerySchema, 'query'), reviewController.highlights);
router.get('/reviews/summary', cachePublic, reviewController.summary);
router.post('/reviews', noStore, reviewLimiter, validate(submitReviewSchema), reviewController.submit);

// Availability changes with every booking, so it is always fetched fresh.
router.get('/clinics/:id/available-dates', noStore, validateIdParam, clinicController.availableDates);
router.get('/bookings/slots', noStore, validate(slotsQuerySchema, 'query'), bookingController.slots);
router.post('/bookings', noStore, bookingLimiter, validate(createBookingSchema), bookingController.create);

export default router;
