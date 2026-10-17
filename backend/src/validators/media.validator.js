import Joi from 'joi';
import { MEDIA } from '../config/constants.js';
import { env } from '../config/env.js';
import { detectImageType } from '../utils/image.js';
import { bilingual, bilingualKeys, buildResourceSchemas, paginationSchema } from './common.js';

const isAllowedType = (mimeType) => MEDIA.mimeTypes.includes(mimeType);

// The declared type gives quick feedback; the file's own bytes decide.
const imageFileSchema = Joi.object({
  mimetype: Joi.string().custom((value, helpers) => (isAllowedType(value) ? value : helpers.error('media.type'))),
  size: Joi.number().custom((value, helpers) =>
    value <= env.uploads.maxBytes ? value : helpers.error('media.size', { max: env.uploads.maxMegabytes }),
  ),
  buffer: Joi.binary().custom((value, helpers) =>
    isAllowedType(detectImageType(value)) ? value : helpers.error('media.content'),
  ),
}).unknown();

export const uploadSchema = Joi.array()
  .items(imageFileSchema)
  .max(MEDIA.maxFilesPerUpload)
  .custom((files, helpers) => (files.length ? files : helpers.error('media.missing')))
  .label('files');

export const mediaAltSchema = buildResourceSchemas(
  bilingual('alt', Joi.string().trim().max(300)),
  bilingualKeys('alt'),
).full;

export const mediaListQuerySchema = paginationSchema;

export const mediaRemoveQuerySchema = Joi.object({ force: Joi.boolean().default(false) });
