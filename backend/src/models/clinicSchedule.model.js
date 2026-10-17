import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';
import { clinicIdColumn, idColumn, timeColumn } from './columns.js';

export class ClinicSchedule extends Model {}

ClinicSchedule.init(
  {
    ...idColumn,
    ...clinicIdColumn,
    dayOfWeek: { type: DataTypes.SMALLINT, allowNull: false },
    startTime: timeColumn('startTime'),
    endTime: timeColumn('endTime'),
  },
  { sequelize, tableName: 'clinic_schedules' },
);
