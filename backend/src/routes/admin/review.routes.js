import { Router } from 'express';
import { PERMISSIONS } from '../../config/permissions.js';
import { reviewController } from '../../controllers/review.controller.js';
import { authorize } from '../../middlewares/authorize.js';
import { validate, validateIdParam } from '../../middlewares/validate.js';
import { adminReviewQuerySchema, reviewUpdateSchema } from '../../validators/review.validator.js';

const router = Router();

router.use(authorize(PERMISSIONS.REVIEWS_MANAGE));
router.get('/', validate(adminReviewQuerySchema, 'query'), reviewController.list);
router.get('/summary', reviewController.countByStatus);
router.patch('/:id', validateIdParam, validate(reviewUpdateSchema), reviewController.update);
router.delete('/:id', validateIdParam, reviewController.remove);

export default router;
