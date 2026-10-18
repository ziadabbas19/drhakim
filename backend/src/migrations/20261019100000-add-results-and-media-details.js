import { ABOUT_ITEM_TYPE_ENUM, replaceEnum } from './helpers/enums.js';

const TYPES_WITHOUT_RESULT = ['qualification', 'timeline', 'membership', 'stat', 'surgery'];
const TYPES_WITH_RESULT = [...TYPES_WITHOUT_RESULT, 'result'];

const MEDIA_IMPORT_KEY_UNIQUE = 'media_import_key_unique';
const MEDIA_FOCUS_CHECK = 'media_focus_check';

const mediaColumns = (Sequelize) => ({
  // Set on photos added by `npm run import:images`, so running it again finds them instead of uploading copies.
  import_key: { type: Sequelize.STRING(120), allowNull: true },
  // The point kept in view when the image is cropped to fit a frame, in percent from the left and the top.
  focus_x: { type: Sequelize.SMALLINT, allowNull: true },
  focus_y: { type: Sequelize.SMALLINT, allowNull: true },
  // Cut-out portraits (transparent background) are shown without a frame.
  has_transparency: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
});

// Adds the before/after list to the About page, and the image details used by the photo import.
export async function up(queryInterface, Sequelize) {
  await queryInterface.sequelize.transaction(async (transaction) => {
    const runSql = (sql) => queryInterface.sequelize.query(sql, { transaction });

    await replaceEnum(runSql, ABOUT_ITEM_TYPE_ENUM, TYPES_WITH_RESULT);

    for (const [name, definition] of Object.entries(mediaColumns(Sequelize))) {
      await queryInterface.addColumn('media', name, definition, { transaction });
    }
    await queryInterface.addConstraint('media', {
      type: 'unique',
      name: MEDIA_IMPORT_KEY_UNIQUE,
      fields: ['import_key'],
      transaction,
    });
    await runSql(
      `ALTER TABLE media ADD CONSTRAINT ${MEDIA_FOCUS_CHECK} CHECK (focus_x BETWEEN 0 AND 100 AND focus_y BETWEEN 0 AND 100)`,
    );
  });
}

// Removes the before/after items (and where their photos were used); the photos stay in the library.
export async function down(queryInterface, Sequelize) {
  await queryInterface.sequelize.transaction(async (transaction) => {
    const runSql = (sql) => queryInterface.sequelize.query(sql, { transaction });

    await runSql(
      `DELETE FROM media_links WHERE owner_type = 'aboutItem'
         AND owner_id IN (SELECT id FROM about_items WHERE type = 'result')`,
    );
    await runSql(`DELETE FROM about_items WHERE type = 'result'`);
    await replaceEnum(runSql, ABOUT_ITEM_TYPE_ENUM, TYPES_WITHOUT_RESULT);

    await queryInterface.removeConstraint('media', MEDIA_FOCUS_CHECK, { transaction });
    await queryInterface.removeConstraint('media', MEDIA_IMPORT_KEY_UNIQUE, { transaction });
    for (const name of Object.keys(mediaColumns(Sequelize))) {
      await queryInterface.removeColumn('media', name, { transaction });
    }
  });
}
