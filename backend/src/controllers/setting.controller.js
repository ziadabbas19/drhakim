import { settingService } from '../services/setting.service.js';
import { RESPONSES, respond } from '../utils/response.js';

export const settingController = {
  get: respond(() => settingService.getAll()),
  update: respond((req) => settingService.update(req.body), RESPONSES.saved),
};
