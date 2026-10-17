import { Router } from 'express';
import { PERMISSIONS } from '../../config/permissions.js';
import { mediaController } from '../../controllers/media.controller.js';
import { authorize } from '../../middlewares/authorize.js';
import { receiveImages } from '../../middlewares/upload.js';
import { validate, validateIdParam } from '../../middlewares/validate.js';
import {
  mediaAltSchema,
  mediaListQuerySchema,
  mediaRemoveQuerySchema,
  uploadSchema,
} from '../../validators/media.validator.js';

const router = Router();

router.use(authorize(PERMISSIONS.MEDIA_MANAGE));
router.get('/', validate(mediaListQuerySchema, 'query'), mediaController.list);
router.post('/', receiveImages, validate(uploadSchema, 'files'), mediaController.upload);
router.patch('/:id', validateIdParam, validate(mediaAltSchema), mediaController.update);
router.delete('/:id', validateIdParam, validate(mediaRemoveQuerySchema, 'query'), mediaController.remove);

export default router;
