import { messages } from '../config/messages.js';
import { teamService } from '../services/team.service.js';
import { respond } from '../utils/response.js';
import { createCrudController } from './crud.controller.js';

export const teamController = {
  ...createCrudController(teamService),
  resetPassword: respond((req) => teamService.resetPassword(req.params.id, req.body.password, req.user), {
    message: messages.team.passwordReset,
  }),
};
