import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';
import { idColumn, sortOrderColumn } from './columns.js';

export class MediaLink extends Model {}

// Where an image is used: one row per image in a slot (see config/mediaSlots.js).
// The foreign key to media is RESTRICT, so an image in use cannot be deleted by accident.
MediaLink.init(
  {
    ...idColumn,
    mediaId: { type: DataTypes.UUID, allowNull: false },
    ownerType: { type: DataTypes.STRING(30), allowNull: false },
    ownerId: { type: DataTypes.UUID, allowNull: true },
    slot: { type: DataTypes.STRING(30), allowNull: false },
    ...sortOrderColumn,
  },
  { sequelize, tableName: 'media_links' },
);
