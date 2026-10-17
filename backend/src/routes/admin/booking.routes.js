import { Router } from 'express';
import { PERMISSIONS } from '../../config/permissions.js';
import { bookingController } from '../../controllers/booking.controller.js';
import { authorize } from '../../middlewares/authorize.js';
import { validate, validateIdParam } from '../../middlewares/validate.js';
import { bookingListQuerySchema, bookingStatusSchema } from '../../validators/booking.validator.js';

const router = Router();

router.use(authorize(PERMISSIONS.BOOKINGS_MANAGE));
router.get('/', validate(bookingListQuerySchema, 'query'), bookingController.list);
router.patch('/:id/status', validateIdParam, validate(bookingStatusSchema), bookingController.update);
router.delete('/:id', validateIdParam, bookingController.remove);

export default router;
