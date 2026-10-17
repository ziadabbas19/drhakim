import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';
import { ABOUT_ITEM_TYPES } from '../config/constants.js';
import { activeColumn, idColumn, sortOrderColumn, translatableColumns } from './columns.js';

export class AboutItem extends Model {}

// Every About page list (qualifications, timeline, memberships, stats, surgeries)
// shares this table; `type` tells them apart and each type uses the fields it needs.
AboutItem.init(
  {
    ...idColumn,
    type: { type: DataTypes.ENUM(...Object.values(ABOUT_ITEM_TYPES)), allowNull: false },
    ...translatableColumns({
      title: { type: DataTypes.STRING(200) },
      subtitle: { type: DataTypes.STRING(200), required: false },
      body: { type: DataTypes.TEXT, required: false },
    }),
    value: { type: DataTypes.STRING(40), allowNull: true },
    category: { type: DataTypes.STRING(30), allowNull: true },
    ...activeColumn,
    ...sortOrderColumn,
  },
  { sequelize, tableName: 'about_items' },
);
