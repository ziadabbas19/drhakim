import { Router } from 'express';
import { PERMISSIONS } from '../../config/permissions.js';
import { serviceController } from '../../controllers/service.controller.js';
import { authorize } from '../../middlewares/authorize.js';
import { validate } from '../../middlewares/validate.js';
import { reorderSchema } from '../../validators/common.js';
import { serviceSchemas } from '../../validators/service.validator.js';
import { mountCrudRoutes } from '../crud.routes.js';

const router = Router();

// Registered before the CRUD routes so "order" is not read as an id.
router.put(
  '/order',
  authorize(PERMISSIONS.SERVICES_MANAGE),
  validate(reorderSchema),
  serviceController.reorder,
);

export default mountCrudRoutes(router, {
  controller: serviceController,
  schemas: serviceSchemas,
  permissions: { view: PERMISSIONS.SERVICES_MANAGE, manage: PERMISSIONS.SERVICES_MANAGE },
});
