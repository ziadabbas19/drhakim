import { aboutService } from '../services/about.service.js';
import { RESPONSES, respond } from '../utils/response.js';

export const aboutController = {
  getPublic: respond(() => aboutService.getPublicContent()),
  getProfile: respond(() => aboutService.getProfile()),
  updateProfile: respond((req) => aboutService.updateProfile(req.body), RESPONSES.saved),
  listItems: respond((req) => aboutService.listItems(req.params.type)),
  createItem: respond((req) => aboutService.createItem(req.params.type, req.body), RESPONSES.created),
  updateItem: respond((req) => aboutService.updateItem(req.params.type, req.params.id, req.body), RESPONSES.saved),
  removeItem: respond((req) => aboutService.removeItem(req.params.type, req.params.id), RESPONSES.deleted),
  reorderItems: respond((req) => aboutService.reorderItems(req.params.type, req.body.ids), RESPONSES.saved),
};
