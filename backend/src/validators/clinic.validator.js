import Joi from 'joi';
import { SLOT_DURATION } from '../config/constants.js';
import { buildResourceSchemas, fields } from './common.js';

export const clinicSchemas = buildResourceSchemas(
  {
    name: Joi.string().trim().min(2).max(100).label('اسم العيادة'),
    city: Joi.string().trim().min(2).max(60).label('المدينة'),
    address: Joi.string().trim().min(5).max(255).label('العنوان'),
    phone: fields.contactPhone,
    mapUrl: fields.url.allow('', null).label('رابط الخريطة'),
    slotDurationMinutes: Joi.number()
      .integer()
      .min(SLOT_DURATION.min)
      .max(SLOT_DURATION.max)
      .label('مدة الكشف بالدقائق'),
    isActive: fields.isActive,
    sortOrder: fields.sortOrder,
  },
  ['name', 'city', 'address', 'phone', 'slotDurationMinutes'],
);
