import { Router } from 'express';
import { PERMISSIONS } from '../../config/permissions.js';
import { clinicController } from '../../controllers/clinic.controller.js';
import { validate, validateIdParam } from '../../middlewares/validate.js';
import { clinicSchemas } from '../../validators/clinic.validator.js';
import { dayOffParamsSchema, dayOffSchema } from '../../validators/dayOff.validator.js';
import { scheduleSchema } from '../../validators/schedule.validator.js';
import { mountCrudRoutes, permissionGuards } from '../crud.routes.js';

const CLINIC_PERMISSIONS = { view: PERMISSIONS.CLINICS_VIEW, manage: PERMISSIONS.CLINICS_MANAGE };

const router = Router();
const { canView, canManage } = permissionGuards(CLINIC_PERMISSIONS);

mountCrudRoutes(router, { controller: clinicController, schemas: clinicSchemas, permissions: CLINIC_PERMISSIONS });

router.put('/:id/schedule', canManage, validateIdParam, validate(scheduleSchema), clinicController.replaceSchedule);
router.get('/:id/days-off', canView, validateIdParam, clinicController.listDaysOff);
router.post('/:id/days-off', canManage, validateIdParam, validate(dayOffSchema), clinicController.addDayOff);
router.delete(
  '/:id/days-off/:dayOffId',
  canManage,
  validate(dayOffParamsSchema, 'params'),
  clinicController.removeDayOff,
);

export default router;
