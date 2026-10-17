import { Router } from 'express';
import { noStore } from '../../middlewares/cache.js';
import { authenticate } from '../../middlewares/authenticate.js';
import aboutRoutes from './about.routes.js';
import bookingRoutes from './booking.routes.js';
import clinicRoutes from './clinic.routes.js';
import mediaRoutes from './media.routes.js';
import reviewRoutes from './review.routes.js';
import serviceRoutes from './service.routes.js';
import settingRoutes from './setting.routes.js';
import teamRoutes from './team.routes.js';

const router = Router();

// Admin responses carry both languages and private data, so they are never cached.
router.use(noStore, authenticate);
router.use('/about', aboutRoutes);
router.use('/bookings', bookingRoutes);
router.use('/clinics', clinicRoutes);
router.use('/media', mediaRoutes);
router.use('/reviews', reviewRoutes);
router.use('/services', serviceRoutes);
router.use('/settings', settingRoutes);
router.use('/team', teamRoutes);

export default router;
