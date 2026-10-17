import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';
import { activeColumn, idColumn, sortOrderColumn } from './columns.js';

export class Service extends Model {}

Service.init(
  {
    ...idColumn,
    title: { type: DataTypes.STRING(100), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    icon: { type: DataTypes.STRING(40), allowNull: false },
    isFeatured: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    ...activeColumn,
    ...sortOrderColumn,
  },
  { sequelize, tableName: 'services' },
);
