// Shared column definitions. This file sits in a subfolder, so the migration runner does not
// treat it as a migration.
export const buildColumnHelpers = (Sequelize) => ({
  base: {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: Sequelize.literal('gen_random_uuid()'),
    },
  },
  timestamps: {
    created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') },
    updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') },
  },
  text: (length, allowNull = false) => ({ type: Sequelize.STRING(length), allowNull }),
  flag: (defaultValue) => ({ type: Sequelize.BOOLEAN, allowNull: false, defaultValue }),
  sortOrder: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
  time: { type: Sequelize.TIME, allowNull: false },
  date: { type: Sequelize.DATEONLY, allowNull: false },
  clinicReference: (onDelete) => ({
    type: Sequelize.UUID,
    allowNull: false,
    references: { model: 'clinics', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete,
  }),
});

export const createTableWith = (queryInterface, column, transaction) => (name, columns) =>
  queryInterface.createTable(name, { ...column.base, ...columns, ...column.timestamps }, { transaction });
