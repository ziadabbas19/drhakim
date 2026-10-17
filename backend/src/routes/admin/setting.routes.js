import { Router } from 'express';
import { PERMISSIONS } from '../../config/permissions.js';
import { settingController } from '../../controllers/setting.controller.js';
import { authorize } from '../../middlewares/authorize.js';
import { validate } from '../../middlewares/validate.js';
import { settingsSchema } from '../../validators/setting.validator.js';

const router = Router();

router.use(authorize(PERMISSIONS.SETTINGS_MANAGE));
router.get('/', settingController.get);
router.put('/', validate(settingsSchema), settingController.update);

export default router;
