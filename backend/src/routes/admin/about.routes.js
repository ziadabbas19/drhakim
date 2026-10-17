import { Router } from 'express';
import { PERMISSIONS } from '../../config/permissions.js';
import { aboutController } from '../../controllers/about.controller.js';
import { authorize } from '../../middlewares/authorize.js';
import { validate } from '../../middlewares/validate.js';
import {
  aboutItemParamsSchema,
  aboutItemSchemas,
  aboutProfileSchema,
  aboutTypeParamsSchema,
} from '../../validators/about.validator.js';
import { reorderSchema } from '../../validators/common.js';

const router = Router();

// Each list has its own rules, chosen from the :type in the URL.
const itemSchema = (variant) => (req) => aboutItemSchemas[req.params.type][variant];
const typeParams = validate(aboutTypeParamsSchema, 'params');
const itemParams = validate(aboutItemParamsSchema, 'params');

router.use(authorize(PERMISSIONS.CONTENT_MANAGE));
router.get('/profile', aboutController.getProfile);
router.put('/profile', validate(aboutProfileSchema), aboutController.updateProfile);

router.get('/items/:type', typeParams, aboutController.listItems);
router.post('/items/:type', typeParams, validate(itemSchema('full')), aboutController.createItem);
// Registered before /:id so "order" is not read as an id.
router.put('/items/:type/order', typeParams, validate(reorderSchema), aboutController.reorderItems);
router.put('/items/:type/:id', itemParams, validate(itemSchema('full')), aboutController.updateItem);
router.patch('/items/:type/:id', itemParams, validate(itemSchema('partial')), aboutController.updateItem);
router.delete('/items/:type/:id', itemParams, aboutController.removeItem);

export default router;
