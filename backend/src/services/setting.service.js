import { SiteSetting } from '../models/index.js';

export const settingService = {
  async getAll() {
    const settings = await SiteSetting.findAll({ order: [['key', 'ASC']] });
    return Object.fromEntries(settings.map(({ key, value }) => [key, value]));
  },

  async update(values) {
    const rows = Object.entries(values).map(([key, value]) => ({ key, value }));
    await SiteSetting.bulkCreate(rows, { updateOnDuplicate: ['value', 'updatedAt'] });
    return settingService.getAll();
  },
};
