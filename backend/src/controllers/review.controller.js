import { messages } from '../i18n/index.js';
import { reviewService } from '../services/review.service.js';
import { RESPONSES, respond } from '../utils/response.js';

export const reviewController = {
  submit: respond((req) => reviewService.submit(req.body), { status: 201, message: messages.reviews.received }),
  listApproved: respond((req) => reviewService.listApproved(req.query)),
  highlights: respond((req) => reviewService.highlights(req.query.limit)),
  summary: respond(() => reviewService.summary()),
  list: respond((req) => reviewService.list(req.query)),
  countByStatus: respond(() => reviewService.countByStatus()),
  update: respond((req) => reviewService.moderate(req.params.id, req.body, req.user), RESPONSES.saved),
  remove: respond((req) => reviewService.remove(req.params.id), RESPONSES.deleted),
};
