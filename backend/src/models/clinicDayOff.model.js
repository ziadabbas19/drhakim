import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';
import { DAY_OFF_REASONS } from '../config/constants.js';
import { clinicIdColumn, idColumn } from './columns.js';

export class ClinicDayOff extends Model {}

ClinicDayOff.init(
  {
    ...idColumn,
    ...clinicIdColumn,
    date: { type: DataTypes.DATEONLY, allowNull: false },
    reason: { type: DataTypes.ENUM(...DAY_OFF_REASONS), allowNull: false },
  },
  { sequelize, tableName: 'clinic_days_off' },
);
