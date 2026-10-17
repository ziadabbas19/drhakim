import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';
import { activeColumn, idColumn, sortOrderColumn, translatableColumns } from './columns.js';

export class Clinic extends Model {}

Clinic.init(
  {
    ...idColumn,
    ...translatableColumns({
      name: { type: DataTypes.STRING(100) },
      city: { type: DataTypes.STRING(60) },
      address: { type: DataTypes.STRING(255) },
    }),
    phone: { type: DataTypes.STRING(20), allowNull: false },
    mapUrl: { type: DataTypes.STRING(500), allowNull: true },
    slotDurationMinutes: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 20 },
    ...activeColumn,
    ...sortOrderColumn,
  },
  { sequelize, tableName: 'clinics' },
);
