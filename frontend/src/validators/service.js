import Joi from 'joi';

export const serviceSchema = Joi.object({
  title: Joi.string().trim().min(2).max(100).required().label('اسم الخدمة'),
  description: Joi.string().trim().min(10).max(1000).required().label('الوصف'),
  icon: Joi.string().required().label('الأيقونة'),
  isFeatured: Joi.boolean(),
});
