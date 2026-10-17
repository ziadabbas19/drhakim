import { RESPONSES, respond } from '../utils/response.js';

const CRUD_HANDLERS = {
  list: (service) => respond((req) => service.list(req.query)),
  listActive: (service) => respond(() => service.listActive()),
  findById: (service) => respond((req) => service.findById(req.params.id)),
  create: (service) => respond((req) => service.create(req.body, req.user), RESPONSES.created),
  update: (service) => respond((req) => service.update(req.params.id, req.body, req.user), RESPONSES.saved),
  remove: (service) => respond((req) => service.remove(req.params.id, req.user), RESPONSES.deleted),
  reorder: (service) => respond((req) => service.reorder(req.body.ids), RESPONSES.saved),
};

// Handlers are created only for the methods the service actually provides.
export const createCrudController = (service) =>
  Object.fromEntries(
    Object.entries(CRUD_HANDLERS)
      .filter(([method]) => typeof service[method] === 'function')
      .map(([method, createHandler]) => [method, createHandler(service)]),
  );
