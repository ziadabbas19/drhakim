import Joi from 'joi';
import { bilingual } from './fields.js';

const BYTES_PER_MB = 1024 * 1024;

// Checked before uploading, with the limits the API sends with the library; the API checks
// the file contents again.
const uploadSchema = ({ mimeTypes, maxMegabytes, maxFiles }) =>
  Joi.array()
    .items(
      Joi.object({
        name: Joi.string(),
        type: Joi.string()
          .valid(...mimeTypes)
          .messages({ 'any.only': 'media.invalidType' }),
        size: Joi.number()
          .max(maxMegabytes * BYTES_PER_MB)
          .messages({ 'number.max': 'media.tooLarge' }),
      }),
    )
    .max(maxFiles)
    .messages({ 'array.max': 'media.tooMany' });

// Returns a translated message for the first problem, or null when every file can be uploaded.
export const findUploadProblem = (files, limits, t) => {
  const descriptors = files.map(({ name, type, size }) => ({ name, type, size }));
  const { error } = uploadSchema(limits).validate(descriptors);
  if (!error) return null;
  const [detail] = error.details;
  return t(detail.message, {
    name: descriptors[detail.path[0]]?.name,
    size: limits.maxMegabytes,
    count: limits.maxFiles,
  });
};

export const mediaAltSchema = Joi.object(bilingual('alt', Joi.string().trim().max(300)));
