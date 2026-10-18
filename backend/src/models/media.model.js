import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';
import { idColumn, translatableColumns } from './columns.js';

export class Media extends Model {}

Media.init(
  {
    ...idColumn,
    url: { type: DataTypes.STRING(1000), allowNull: false },
    storageKey: { type: DataTypes.STRING(255), allowNull: false },
    provider: { type: DataTypes.STRING(20), allowNull: false },
    width: { type: DataTypes.INTEGER, allowNull: false },
    height: { type: DataTypes.INTEGER, allowNull: false },
    mimeType: { type: DataTypes.STRING(40), allowNull: false },
    sizeBytes: { type: DataTypes.INTEGER, allowNull: false },
    ...translatableColumns({ alt: { type: DataTypes.STRING(300), required: false } }),
    // A tiny blurred copy shown while the image loads.
    placeholder: { type: DataTypes.TEXT, allowNull: true },
    // Smaller copies for srcset: [{ width, url }], smallest first.
    variants: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
    // A cut-out (transparent background) is shown without a frame.
    hasTransparency: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    // The point kept in view when the image is cropped to fit a frame, in percent from the left and the top.
    focusX: { type: DataTypes.SMALLINT, allowNull: true },
    focusY: { type: DataTypes.SMALLINT, allowNull: true },
    // Set on photos added by `npm run import:images`, so running it again does not upload copies.
    importKey: { type: DataTypes.STRING(120), allowNull: true, unique: true },
  },
  { sequelize, tableName: 'media' },
);
