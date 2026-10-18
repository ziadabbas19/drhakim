import { randomUUID } from 'node:crypto';
import { literal } from 'sequelize';
import { MEDIA } from '../config/constants.js';
import { env } from '../config/env.js';
import { messages } from '../i18n/index.js';
import { Media, MediaLink } from '../models/index.js';
import { getStorage } from '../storage/index.js';
import { ApiError } from '../utils/ApiError.js';
import { processImage } from '../utils/image.js';
import { createCrudService } from './crud.service.js';
import { mediaLinkService } from './mediaLink.service.js';

const USAGE_COUNT = literal('(SELECT COUNT(*)::int FROM media_links WHERE media_links.media_id = "Media"."id")');

const crud = createCrudService(Media, {
  order: [['createdAt', 'DESC']],
  attributes: { include: [[USAGE_COUNT, 'usageCount']] },
});

// Sent with the library so the dashboard checks files against the same limits as the API.
const UPLOAD_LIMITS = Object.freeze({
  maxMegabytes: env.uploads.maxMegabytes,
  maxFiles: MEDIA.maxFilesPerUpload,
  mimeTypes: MEDIA.mimeTypes,
});

const decode = async (buffer) => {
  try {
    return await processImage(buffer);
  } catch {
    throw ApiError.badRequest(messages.media.unreadable);
  }
};

// Stores a decoded image and records it in the library, with any extra details (alt text, focus).
const store = async ({ variants, placeholder, ...image }, { key = randomUUID(), details = {}, transaction } = {}) => {
  const storage = getStorage();
  const stored = await storage.upload({ key, variants, ...image });
  return Media.create(
    {
      url: stored.url,
      storageKey: stored.storageKey,
      provider: storage.name,
      width: image.width,
      height: image.height,
      mimeType: image.mimeType,
      sizeBytes: image.sizeBytes,
      hasTransparency: image.hasTransparency,
      placeholder,
      variants: stored.variants,
      ...details,
    },
    { transaction },
  );
};

export const mediaService = {
  list: async (query) => ({ ...(await crud.list(query)), limits: UPLOAD_LIMITS }),
  update: crud.update,

  // Every file is decoded before anything is stored, so one broken file rejects the whole upload.
  async upload(files) {
    const images = [];
    for (const file of files) images.push(await decode(file.buffer));

    const created = [];
    for (const image of images) created.push(await crud.findById((await store(image)).id));
    return created;
  },

  // Adds a photo from `npm run import:images` under a fixed key, unless the library already has
  // it. `load` returns the file and is only called when the photo is new; `link` saves where the
  // photo is used, in the same transaction as its record. A file left in storage by a failed
  // attempt is overwritten by the next one, as the key stays the same.
  async importImage({ importKey, load, details = {}, link = async () => {} }) {
    const existing = await Media.findOne({ where: { importKey } });
    if (existing) return { media: existing, created: false };

    const image = await decode(await load());
    const media = await Media.sequelize.transaction(async (transaction) => {
      const record = await store(image, { key: `import-${importKey}`, details: { importKey, ...details }, transaction });
      await link(record, transaction);
      return record;
    });
    return { media: await crud.findById(media.id), created: true };
  },

  // An image that is still in use is only deleted when the request explicitly confirms it.
  async remove(id, { force = false } = {}) {
    const media = await crud.findById(id);
    const usages = await mediaLinkService.usagesOf(id);
    if (usages.length && !force) {
      throw ApiError.conflict(messages.media.inUse, { usages }, { count: usages.length });
    }

    await Media.sequelize.transaction(async (transaction) => {
      await MediaLink.destroy({ where: { mediaId: id }, transaction });
      await media.destroy({ transaction });
    });
    // The record is already gone; a file left behind by a storage error is harmless.
    await getStorage(media.provider)
      .remove(media.storageKey)
      .catch((error) => console.error(`Could not remove stored file ${media.storageKey}:`, error.message));
  },
};
