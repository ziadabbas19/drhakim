import Joi from 'joi';
import { buildResourceSchemas, fields } from './common.js';

export const serviceSchemas = buildResourceSchemas(
  {
    title: Joi.string().trim().min(2).max(100).label('اسم الخدمة'),
    description: Joi.string().trim().min(10).max(1000).label('الوصف'),
    icon: Joi.string().trim().max(40).label('الأيقونة'),
    isFeatured: Joi.boolean().label('خدمة مميزة'),
    isActive: fields.isActive,
    sortOrder: fields.sortOrder,
  },
  ['title', 'description', 'icon'],
);
