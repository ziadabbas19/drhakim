import { DataTypes } from 'sequelize';

export const idColumn = {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
};

export const clinicIdColumn = {
  clinicId: { type: DataTypes.UUID, allowNull: false },
};

export const activeColumn = {
  isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
};

export const sortOrderColumn = {
  sortOrder: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
};

// Postgres returns TIME as HH:mm:ss; the API works with HH:mm everywhere.
export const timeColumn = (attribute) => ({
  type: DataTypes.TIME,
  allowNull: false,
  get() {
    return this.getDataValue(attribute)?.slice(0, 5);
  },
});
