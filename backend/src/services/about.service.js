import { ABOUT_ITEM_TYPES } from '../config/constants.js';
import { AboutItem, sequelize } from '../models/index.js';
import { createCrudService } from './crud.service.js';
import { mediaLinkService } from './mediaLink.service.js';
import { aboutProfileSettings } from './setting.service.js';

const aboutItems = createCrudService(AboutItem, { sortable: true, mediaOwner: 'aboutItem' });

const itemsOf = (type) => aboutItems.scoped({ type });

const PUBLIC_ITEMS_WHERE = { isActive: true };

const groupByType = (items) =>
  Object.fromEntries(Object.values(ABOUT_ITEM_TYPES).map((type) => [type, items.filter((item) => item.type === type)]));

export const aboutService = {
  listItems: (type) => itemsOf(type).findAll(),
  createItem: (type, data) => itemsOf(type).create(data),
  updateItem: (type, id, data) => itemsOf(type).update(id, data),
  removeItem: (type, id) => itemsOf(type).remove(id),
  reorderItems: (type, ids) => itemsOf(type).reorder(ids),

  async getProfile() {
    const [texts, media] = await Promise.all([aboutProfileSettings.get(), mediaLinkService.siteMedia()]);
    return { ...texts, ...media };
  },

  async updateProfile(data) {
    const { fields, media } = mediaLinkService.splitInput('site', data);
    await mediaLinkService.assertExist(media);
    await sequelize.transaction(async (transaction) => {
      await aboutProfileSettings.write(fields, transaction);
      await mediaLinkService.saveSiteMedia(media, transaction);
    });
    return aboutService.getProfile();
  },

  async getPublicContent() {
    const [profile, items] = await Promise.all([aboutService.getProfile(), aboutItems.findAll(PUBLIC_ITEMS_WHERE)]);
    return { profile, items: groupByType(items) };
  },
};
