import { Service } from '../models/index.js';
import { createCrudService } from './crud.service.js';

export const serviceService = createCrudService(Service, { sortable: true, mediaOwner: 'service' });
