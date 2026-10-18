import { SiteSetting } from '../models/index.js';
import { aboutProfileSettings, contactSettings } from '../services/setting.service.js';
import { SETTING_VALUES } from './content.js';
import { createMissing, fillMissingTranslations } from './seedHelpers.js';

export const seedSettings = async () => {
  const rows = [...contactSettings.storedKeys, ...aboutProfileSettings.storedKeys].map((key) => ({
    key,
    valueAr: '',
    valueEn: null,
    ...SETTING_VALUES[key],
  }));
  const created = await createMissing(SiteSetting, rows, 'key');
  const translated = await fillMissingTranslations(SiteSetting, rows, ['key']);
  return `site_settings: ${created} keys created, English added to ${translated}`;
};
