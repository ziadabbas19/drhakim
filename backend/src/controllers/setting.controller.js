import { contactSettings } from '../services/setting.service.js';
import { RESPONSES, respond } from '../utils/response.js';

export const settingController = {
  get: respond(() => contactSettings.get()),
  update: respond((req) => contactSettings.update(req.body), RESPONSES.saved),
};
