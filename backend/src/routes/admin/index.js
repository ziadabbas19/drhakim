import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate.js';
import bookingRoutes from './booking.routes.js';
import clinicRoutes from './clinic.routes.js';
import serviceRoutes from './service.routes.js';
import settingRoutes from './setting.routes.js';
import teamRoutes from './team.routes.js';

const router = Router();

router.use(authenticate);
router.use('/bookings', bookingRoutes);
router.use('/clinics', clinicRoutes);
router.use('/services', serviceRoutes);
router.use('/settings', settingRoutes);
router.use('/team', teamRoutes);

export default router;
