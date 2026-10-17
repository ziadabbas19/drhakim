import { messages } from '../i18n/index.js';
import { mediaService } from '../services/media.service.js';
import { RESPONSES, respond } from '../utils/response.js';

export const mediaController = {
  list: respond((req) => mediaService.list(req.query)),
  upload: respond((req) => mediaService.upload(req.files), { status: 201, message: messages.media.uploaded }),
  update: respond((req) => mediaService.update(req.params.id, req.body), RESPONSES.saved),
  remove: respond((req) => mediaService.remove(req.params.id, req.query), RESPONSES.deleted),
};
