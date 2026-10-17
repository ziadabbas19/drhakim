import { ApiError } from '../utils/ApiError.js';
import { mediaLinkService } from './mediaLink.service.js';

export const SORTABLE_ORDER = Object.freeze([
  ['sortOrder', 'ASC'],
  ['createdAt', 'ASC'],
]);

const CREATED_ORDER = Object.freeze([['createdAt', 'ASC']]);

// Options:
//   where       scopes every query (e.g. About items of one type) and is merged into new records
//   mediaOwner  attaches images from the media library (see config/mediaSlots.js)
export const createCrudService = (Model, options = {}) => {
  const {
    sortable = false,
    order = sortable ? SORTABLE_ORDER : CREATED_ORDER,
    include = [],
    attributes,
    buildWhere = () => ({}),
    where: scope = {},
    mediaOwner = null,
  } = options;

  const withMedia = (result) => (mediaOwner ? mediaLinkService.attach(mediaOwner, result) : result);

  const findRecord = async (id) => {
    const record = await Model.findOne({ where: { ...scope, id }, include, order, attributes });
    if (!record) throw ApiError.notFound();
    return record;
  };

  const findById = async (id) => withMedia(await findRecord(id));

  const findAllOrdered = async (where = {}) =>
    withMedia(await Model.findAll({ where: { ...scope, ...where }, include, order, attributes }));

  const nextSortOrder = async () => ((await Model.max('sortOrder', { where: scope })) ?? 0) + 1;

  // The record and its image selections are saved together or not at all.
  const save = async (data, persist) => {
    const { fields, media } = mediaOwner ? mediaLinkService.splitInput(mediaOwner, data) : { fields: data, media: {} };
    await mediaLinkService.assertExist(media);
    return Model.sequelize.transaction(async (transaction) => {
      const record = await persist(fields, transaction);
      if (mediaOwner) await mediaLinkService.replace(mediaOwner, record.id, media, transaction);
      return record;
    });
  };

  const reorder = async (ids) => {
    await Model.sequelize.transaction(async (transaction) => {
      for (const [index, id] of ids.entries()) {
        await Model.update({ sortOrder: index + 1 }, { where: { ...scope, id }, transaction });
      }
    });
    return findAllOrdered();
  };

  return {
    findById,

    findAll: findAllOrdered,

    scoped: (where) => createCrudService(Model, { ...options, where: { ...scope, ...where } }),

    ...('isActive' in Model.getAttributes() && { listActive: () => findAllOrdered({ isActive: true }) }),

    ...(sortable && { reorder }),

    async list({ limit, offset, ...filters } = {}) {
      const { rows, count } = await Model.findAndCountAll({
        where: { ...scope, ...buildWhere(filters) },
        include,
        order,
        attributes,
        limit,
        offset,
        distinct: true,
      });
      return { items: await withMedia(rows), total: count, limit, offset };
    },

    async create(data) {
      const defaults = sortable ? { sortOrder: await nextSortOrder() } : {};
      const record = await save(data, (fields, transaction) =>
        Model.create({ ...defaults, ...fields, ...scope }, { transaction }),
      );
      return findById(record.id);
    },

    async update(id, data) {
      const record = await findRecord(id);
      await save(data, (fields, transaction) => record.update(fields, { transaction }));
      return findById(id);
    },

    async remove(id) {
      const record = await findRecord(id);
      await Model.sequelize.transaction(async (transaction) => {
        if (mediaOwner) await mediaLinkService.removeOwner(mediaOwner, id, transaction);
        await record.destroy({ transaction });
      });
    },
  };
};
