import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';
import { REVIEW_STATUSES } from '../config/constants.js';
import { idColumn } from './columns.js';

export class Review extends Model {}

// A review is stored as the patient wrote it (plain text, in their language) and is public only
// once approved. No contact details or IP addresses are kept.
Review.init(
  {
    ...idColumn,
    patientName: { type: DataTypes.STRING(60), allowNull: false },
    city: { type: DataTypes.STRING(60), allowNull: false },
    rating: { type: DataTypes.SMALLINT, allowNull: false },
    comment: { type: DataTypes.TEXT, allowNull: true },
    status: {
      type: DataTypes.ENUM(...Object.values(REVIEW_STATUSES)),
      allowNull: false,
      defaultValue: REVIEW_STATUSES.PENDING,
    },
    isFeatured: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    fingerprint: { type: DataTypes.STRING(64), allowNull: false },
    reviewedAt: { type: DataTypes.DATE, allowNull: true },
    reviewedBy: { type: DataTypes.UUID, allowNull: true },
  },
  { sequelize, tableName: 'reviews' },
);
