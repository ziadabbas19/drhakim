import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/authenticate.js';
import { noStore } from '../middlewares/cache.js';
import { loginLimiter } from '../middlewares/rateLimiters.js';
import { validate } from '../middlewares/validate.js';
import { changePasswordSchema, loginSchema } from '../validators/auth.validator.js';

const router = Router();

router.use(noStore);
router.post('/login', loginLimiter, validate(loginSchema), authController.login);
router.get('/me', authenticate, authController.me);
router.post('/change-password', authenticate, validate(changePasswordSchema), authController.changePassword);

export default router;
