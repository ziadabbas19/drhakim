import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';
import { ROLES } from '../config/permissions.js';
import { normalizeEmail } from '../utils/normalize.js';
import { activeColumn, idColumn } from './columns.js';

export class User extends Model {
  toJSON() {
    const { passwordHash, ...user } = super.toJSON();
    return user;
  }
}

User.init(
  {
    ...idColumn,
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      set(value) {
        this.setDataValue('email', normalizeEmail(value));
      },
    },
    fullName: { type: DataTypes.STRING(100), allowNull: false },
    passwordHash: { type: DataTypes.STRING(100), allowNull: false },
    role: { type: DataTypes.ENUM(...Object.values(ROLES)), allowNull: false, defaultValue: ROLES.STAFF },
    ...activeColumn,
    mustChangePassword: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    passwordChangedAt: { type: DataTypes.DATE, allowNull: true },
  },
  { sequelize, tableName: 'users' },
);
