import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';
import { idColumn, translatableColumns } from './columns.js';

export class SiteSetting extends Model {}

// Text settings use both language columns; language-neutral ones (phone numbers, links) use value_ar only.
SiteSetting.init(
  {
    ...idColumn,
    key: { type: DataTypes.STRING(60), allowNull: false, unique: true },
    ...translatableColumns({ value: { type: DataTypes.TEXT, defaultValue: '' } }),
  },
  { sequelize, tableName: 'site_settings' },
);
