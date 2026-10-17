import { messages } from '../i18n/index.js';
import { ROLES } from '../config/permissions.js';
import { User, sequelize } from '../models/index.js';
import { ApiError } from '../utils/ApiError.js';
import { hashPassword } from '../utils/password.js';
import { createCrudService } from './crud.service.js';

const crud = createCrudService(User);

const temporaryPasswordFields = async (password) => ({
  passwordHash: await hashPassword(password),
  mustChangePassword: true,
  passwordChangedAt: new Date(),
});

const removesOwnerAccess = (member, changes) =>
  member.role === ROLES.OWNER &&
  member.isActive &&
  (changes.isActive === false || (changes.role !== undefined && changes.role !== ROLES.OWNER));

export const teamService = {
  list: crud.list,

  async create({ password, ...member }) {
    return crud.create({ ...member, ...(await temporaryPasswordFields(password)) });
  },

  async update(id, changes, actor) {
    const changesAccess = changes.role !== undefined || changes.isActive !== undefined;
    if (changesAccess && id === actor.id) throw ApiError.forbidden(messages.team.selfChange);

    return sequelize.transaction(async (transaction) => {
      // Locking active owners first serialises concurrent demotions so one owner always remains.
      const activeOwners = await User.findAll({
        where: { role: ROLES.OWNER, isActive: true },
        order: [['id', 'ASC']],
        lock: transaction.LOCK.UPDATE,
        transaction,
      });
      const member = await User.findByPk(id, { transaction });
      if (!member) throw ApiError.notFound();
      if (removesOwnerAccess(member, changes) && activeOwners.length <= 1) {
        throw ApiError.conflict(messages.team.lastOwner);
      }
      return member.update(changes, { transaction });
    });
  },

  async resetPassword(id, password, actor) {
    if (id === actor.id) throw ApiError.forbidden(messages.team.selfReset);
    const member = await crud.findById(id);
    return member.update(await temporaryPasswordFields(password));
  },
};
