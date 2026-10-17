import multer from 'multer';
import { MEDIA } from '../config/constants.js';
import { env } from '../config/env.js';

const MAX_TEXT_FIELDS = 5;

// Files stay in memory because they are resized and converted before anything is stored.
const parseImages = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: env.uploads.maxBytes, files: MEDIA.maxFilesPerUpload, fields: MAX_TEXT_FIELDS },
}).array('files', MEDIA.maxFilesPerUpload);

export const receiveImages = (req, res, next) =>
  parseImages(req, res, (error) => {
    if (error) return next(error);
    req.files ??= [];
    return next();
  });
