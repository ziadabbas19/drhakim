import { authorize } from '../middlewares/authorize.js';
import { validate, validateIdParam } from '../middlewares/validate.js';
import { paginationSchema } from '../validators/common.js';

export const permissionGuards = ({ view, manage }) => ({ canView: authorize(view), canManage: authorize(manage) });

export const mountCrudRoutes = (router, { controller, schemas, permissions }) => {
  const { canView, canManage } = permissionGuards(permissions);

  router.get('/', canView, validate(paginationSchema, 'query'), controller.list);
  router.get('/:id', canView, validateIdParam, controller.findById);
  router.post('/', canManage, validate(schemas.full), controller.create);
  router.put('/:id', canManage, validateIdParam, validate(schemas.full), controller.update);
  router.patch('/:id', canManage, validateIdParam, validate(schemas.partial), controller.update);

  return router;
};
