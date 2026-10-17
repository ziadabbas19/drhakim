import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';
import { BOOKING_STATUSES } from '../config/constants.js';
import { clinicIdColumn, idColumn, timeColumn } from './columns.js';

export class Booking extends Model {}

Booking.init(
  {
    ...idColumn,
    referenceCode: { type: DataTypes.STRING(12), allowNull: false },
    ...clinicIdColumn,
    date: { type: DataTypes.DATEONLY, allowNull: false },
    time: timeColumn('time'),
    patientName: { type: DataTypes.STRING(100), allowNull: false },
    phone: { type: DataTypes.STRING(20), allowNull: false },
    age: { type: DataTypes.SMALLINT, allowNull: true },
    notes: { type: DataTypes.TEXT, allowNull: true },
    status: {
      type: DataTypes.ENUM(...Object.values(BOOKING_STATUSES)),
      allowNull: false,
      defaultValue: BOOKING_STATUSES.PENDING,
    },
  },
  { sequelize, tableName: 'bookings' },
);
