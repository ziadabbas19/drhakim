import { SiteSetting } from '../models/index.js';
import { settingsSchema } from '../validators/setting.validator.js';
import { createMissing } from './seedHelpers.js';

const DEFAULT_VALUES = {
  doctorPhone: '01001234567',
  whatsappNumber: '01001234567',
  workingHoursNote: 'يُفضّل الحجز المسبق لضمان الموعد، وفي الحالات الطارئة يرجى الاتصال بالعيادة مباشرة.',
};

export const seedSettings = async () => {
  const rows = Object.keys(settingsSchema.describe().keys).map((key) => ({ key, value: DEFAULT_VALUES[key] ?? '' }));
  const created = await createMissing(SiteSetting, rows, 'key');
  return `site_settings: ${created} keys created`;
};
