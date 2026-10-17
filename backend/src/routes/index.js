import { Router } from 'express';
import { sendSuccess } from '../utils/response.js';
import adminRoutes from './admin/index.js';
import authRoutes from './auth.routes.js';
import publicRoutes from './public.routes.js';

const router = Router();

router.get('/health', (_req, res) => sendSuccess(res, { status: 'ok' }));
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/', publicRoutes);

export default router;
