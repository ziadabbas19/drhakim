import { ApiError } from '../utils/ApiError.js';

export const SORTABLE_ORDER = Object.freeze([
  ['sortOrder', 'ASC'],
  ['createdAt', 'ASC'],
]);

const CREATED_ORDER = Object.freeze([['createdAt', 'ASC']]);

export const createCrudService = (
  Model,
  { sortable = false, order = sortable ? SORTABLE_ORDER : CREATED_ORDER, include = [], buildWhere = () => ({}) } = {},
) => {
  const findAllOrdered = (where) => Model.findAll({ where, include, order });

  const findById = async (id) => {
    const record = await Model.findByPk(id, { include, order });
    if (!record) throw ApiError.notFound();
    return record;
  };

  const nextSortOrder = async () => ((await Model.max('sortOrder')) ?? 0) + 1;

  const reorder = async (ids) => {
    await Model.sequelize.transaction(async (transaction) => {
      for (const [index, id] of ids.entries()) {
        await Model.update({ sortOrder: index + 1 }, { where: { id }, transaction });
      }
    });
    return findAllOrdered();
  };

  return {
    findById,

    ...('isActive' in Model.getAttributes() && { listActive: () => findAllOrdered({ isActive: true }) }),

    ...(sortable && { reorder }),

    async list({ limit, offset, ...filters } = {}) {
      const { rows, count } = await Model.findAndCountAll({
        where: buildWhere(filters),
        include,
        order,
        limit,
        offset,
        distinct: true,
      });
      return { items: rows, total: count, limit, offset };
    },

    async create(data) {
      const defaults = sortable ? { sortOrder: await nextSortOrder() } : {};
      const record = await Model.create({ ...defaults, ...data });
      return findById(record.id);
    },

    async update(id, data) {
      const record = await findById(id);
      await record.update(data);
      return findById(id);
    },

    async remove(id) {
      const record = await findById(id);
      await record.destroy();
    },
  };
};
