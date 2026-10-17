import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';
import { idColumn } from './columns.js';

export class SiteSetting extends Model {}

SiteSetting.init(
  {
    ...idColumn,
    key: { type: DataTypes.STRING(60), allowNull: false, unique: true },
    value: { type: DataTypes.TEXT, allowNull: false, defaultValue: '' },
  },
  { sequelize, tableName: 'site_settings' },
);
