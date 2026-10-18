import { Service } from '../models/index.js';
import { SERVICES } from './content.js';
import { seedTranslated } from './seedHelpers.js';

export const seedServices = () => seedTranslated(Service, SERVICES);
