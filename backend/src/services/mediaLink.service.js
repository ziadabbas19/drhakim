import { mediaInputKey, mediaSlotsOf } from '../config/mediaSlots.js';
import { messages } from '../i18n/index.js';
import { AboutItem, Clinic, Media, MediaLink, Service } from '../models/index.js';
import { ApiError } from '../utils/ApiError.js';

const LINK_ORDER = [['sortOrder', 'ASC']];

// Owners whose name is shown when the places an image is used in are listed.
const NAMED_OWNERS = {
  clinic: { model: Clinic, field: 'name' },
  service: { model: Service, field: 'title' },
  aboutItem: { model: AboutItem, field: 'title', extra: ['type'] },
};

const groupBySlot = (ownerType, links) =>
  Object.fromEntries(
    mediaSlotsOf(ownerType).map(([slot, { single }]) => {
      const media = links.filter((link) => link.slot === slot).map((link) => link.media);
      return [slot, single ? (media[0] ?? null) : media];
    }),
  );

const loadOwnerNames = async (links) => {
  const names = new Map();
  for (const [ownerType, { model, field, extra = [] }] of Object.entries(NAMED_OWNERS)) {
    const ids = links.filter((link) => link.ownerType === ownerType).map((link) => link.ownerId);
    if (!ids.length) continue;
    const owners = await model.findAll({
      where: { id: ids },
      attributes: ['id', `${field}Ar`, `${field}En`, ...extra],
    });
    for (const owner of owners) {
      const details = Object.fromEntries(extra.map((name) => [name, owner[name]]));
      names.set(owner.id, { nameAr: owner[`${field}Ar`], nameEn: owner[`${field}En`], ...details });
    }
  }
  return names;
};

export const mediaLinkService = {
  // Separates `<slot>Id` / `<slot>Ids` from the record's own fields. Slots that are not sent stay unchanged.
  splitInput(ownerType, data) {
    const fields = { ...data };
    const media = {};
    for (const [slot, options] of mediaSlotsOf(ownerType)) {
      const key = mediaInputKey(slot, options);
      if (!(key in fields)) continue;
      media[slot] = options.single ? [fields[key]].filter(Boolean) : fields[key];
      delete fields[key];
    }
    return { fields, media };
  },

  async assertExist(media) {
    const ids = [...new Set(Object.values(media).flat())];
    if (ids.length && (await Media.count({ where: { id: ids } })) !== ids.length) {
      throw ApiError.badRequest(messages.media.notFound);
    }
  },

  async replace(ownerType, ownerId, media, transaction) {
    for (const [slot, ids] of Object.entries(media)) {
      await MediaLink.destroy({ where: { ownerType, ownerId, slot }, transaction });
      await MediaLink.bulkCreate(
        ids.map((mediaId, index) => ({ ownerType, ownerId, slot, mediaId, sortOrder: index + 1 })),
        { transaction },
      );
    }
  },

  removeOwner: (ownerType, ownerId, transaction) => MediaLink.destroy({ where: { ownerType, ownerId }, transaction }),

  // Adds each slot to one record or a list of records, e.g. clinic.coverImage and clinic.gallery.
  async attach(ownerType, target) {
    const records = [target].flat().filter(Boolean);
    if (!records.length) return target;

    const links = await MediaLink.findAll({
      where: { ownerType, ownerId: records.map((record) => record.id) },
      include: ['media'],
      order: LINK_ORDER,
    });
    for (const record of records) {
      const slots = groupBySlot(
        ownerType,
        links.filter((link) => link.ownerId === record.id),
      );
      for (const [slot, value] of Object.entries(slots)) record.setDataValue(slot, value);
    }
    return target;
  },

  async siteMedia() {
    const links = await MediaLink.findAll({
      where: { ownerType: 'site', ownerId: null },
      include: ['media'],
      order: LINK_ORDER,
    });
    return groupBySlot('site', links);
  },

  saveSiteMedia: (media, transaction) => mediaLinkService.replace('site', null, media, transaction),

  async usagesOf(mediaId) {
    const links = await MediaLink.findAll({ where: { mediaId }, order: [['createdAt', 'ASC']] });
    const names = await loadOwnerNames(links);
    return links.map(({ ownerType, ownerId, slot }) => ({
      ownerType,
      ownerId,
      slot,
      owner: names.get(ownerId) ?? null,
    }));
  },
};
