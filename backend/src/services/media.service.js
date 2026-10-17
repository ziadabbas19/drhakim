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

export const mediaService = {
  list: async (query) => ({ ...(await crud.list(query)), limits: UPLOAD_LIMITS }),
  update: crud.update,

  // Every file is decoded before anything is stored, so one broken file rejects the whole upload.
  async upload(files) {
    const images = [];
    for (const file of files) images.push(await decode(file.buffer));

    const storage = getStorage();
    const created = [];
    for (const { variants, placeholder, ...image } of images) {
      const stored = await storage.upload({ key: randomUUID(), variants, ...image });
      const media = await Media.create({
        url: stored.url,
        storageKey: stored.storageKey,
        provider: storage.name,
        width: image.width,
        height: image.height,
        mimeType: image.mimeType,
        sizeBytes: image.sizeBytes,
        placeholder,
        variants: stored.variants,
      });
      created.push(await crud.findById(media.id));
    }
    return created;
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
