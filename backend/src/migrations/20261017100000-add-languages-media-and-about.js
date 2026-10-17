import { buildColumnHelpers, createTableWith } from './helpers/columns.js';

const ABOUT_ITEM_TYPES = ['qualification', 'timeline', 'membership', 'stat', 'testimonial', 'surgery'];

// Existing text becomes the Arabic column; the English column starts empty and falls back to Arabic.
const translatedColumns = (Sequelize) => ({
  clinics: { name: Sequelize.STRING(100), city: Sequelize.STRING(60), address: Sequelize.STRING(255) },
  services: { title: Sequelize.STRING(100), description: Sequelize.TEXT },
  site_settings: { value: Sequelize.TEXT },
});

const NEW_TABLES_IN_DROP_ORDER = ['media_links', 'about_items', 'media'];

const forEachTranslatedColumn = async (Sequelize, action) => {
  for (const [table, columns] of Object.entries(translatedColumns(Sequelize))) {
    for (const [name, type] of Object.entries(columns)) {
      await action(table, name, type);
    }
  }
};

export async function up(queryInterface, Sequelize) {
  const column = buildColumnHelpers(Sequelize);

  await queryInterface.sequelize.transaction(async (transaction) => {
    const createTable = createTableWith(queryInterface, column, transaction);

    await forEachTranslatedColumn(Sequelize, async (table, name, type) => {
      await queryInterface.renameColumn(table, name, `${name}_ar`, { transaction });
      await queryInterface.addColumn(table, `${name}_en`, { type, allowNull: true }, { transaction });
    });

    await createTable('media', {
      url: column.text(1000),
      storage_key: column.text(255),
      provider: column.text(20),
      width: { type: Sequelize.INTEGER, allowNull: false },
      height: { type: Sequelize.INTEGER, allowNull: false },
      mime_type: column.text(40),
      size_bytes: { type: Sequelize.INTEGER, allowNull: false },
      alt_ar: column.text(300, true),
      alt_en: column.text(300, true),
      placeholder: { type: Sequelize.TEXT, allowNull: true },
      variants: { type: Sequelize.JSONB, allowNull: false, defaultValue: [] },
    });
    await queryInterface.addIndex('media', ['created_at'], { transaction });

    await createTable('media_links', {
      media_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'media', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      owner_type: column.text(30),
      owner_id: { type: Sequelize.UUID, allowNull: true },
      slot: column.text(30),
      sort_order: column.sortOrder,
    });
    await queryInterface.addIndex('media_links', ['owner_type', 'owner_id', 'slot'], { transaction });
    await queryInterface.addIndex('media_links', ['media_id'], { transaction });

    await createTable('about_items', {
      type: { type: Sequelize.ENUM(...ABOUT_ITEM_TYPES), allowNull: false },
      title_ar: column.text(200),
      title_en: column.text(200, true),
      subtitle_ar: column.text(200, true),
      subtitle_en: column.text(200, true),
      body_ar: { type: Sequelize.TEXT, allowNull: true },
      body_en: { type: Sequelize.TEXT, allowNull: true },
      value: column.text(40, true),
      category: column.text(30, true),
      has_consent: column.flag(false),
      is_active: column.flag(true),
      sort_order: column.sortOrder,
    });
    await queryInterface.addIndex('about_items', ['type', 'sort_order'], { transaction });
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.sequelize.transaction(async (transaction) => {
    for (const table of NEW_TABLES_IN_DROP_ORDER) {
      await queryInterface.dropTable(table, { transaction });
    }
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_about_items_type"', { transaction });

    await forEachTranslatedColumn(Sequelize, async (table, name) => {
      await queryInterface.removeColumn(table, `${name}_en`, { transaction });
      await queryInterface.renameColumn(table, `${name}_ar`, name, { transaction });
    });
  });
}
