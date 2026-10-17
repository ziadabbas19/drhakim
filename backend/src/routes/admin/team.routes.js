import { Router } from 'express';
import { PERMISSIONS } from '../../config/permissions.js';
import { teamController } from '../../controllers/team.controller.js';
import { authorize } from '../../middlewares/authorize.js';
import { validate, validateIdParam } from '../../middlewares/validate.js';
import { paginationSchema } from '../../validators/common.js';
import { createMemberSchema, resetPasswordSchema, updateMemberSchema } from '../../validators/user.validator.js';

const router = Router();

router.use(authorize(PERMISSIONS.TEAM_MANAGE));
router.get('/', validate(paginationSchema, 'query'), teamController.list);
router.post('/', validate(createMemberSchema), teamController.create);
router.patch('/:id', validateIdParam, validate(updateMemberSchema), teamController.update);
router.post('/:id/reset-password', validateIdParam, validate(resetPasswordSchema), teamController.resetPassword);

export default router;
