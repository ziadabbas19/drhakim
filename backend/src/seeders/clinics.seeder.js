import { Clinic } from '../models/index.js';
import { CLINICS } from './content.js';
import { seedTranslated } from './seedHelpers.js';

// Clinics are created without a schedule; the doctor adds working hours from the dashboard.
export const seedClinics = () => seedTranslated(Clinic, CLINICS);
