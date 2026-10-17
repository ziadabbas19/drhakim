import Joi from 'joi';
import { fields } from './common.js';

const optional = (schema) => schema.allow('');

export const settingsSchema = Joi.object({
  doctorPhone: optional(fields.contactPhone.label('هاتف الدكتور')),
  whatsappNumber: optional(fields.mobile.label('رقم واتساب')),
  email: optional(fields.email),
  facebookUrl: optional(fields.url.label('رابط فيسبوك')),
  instagramUrl: optional(fields.url.label('رابط إنستجرام')),
  youtubeUrl: optional(fields.url.label('رابط يوتيوب')),
  tiktokUrl: optional(fields.url.label('رابط تيك توك')),
  workingHoursNote: optional(Joi.string().trim().max(300).label('ملاحظة المواعيد')),
}).min(1);
