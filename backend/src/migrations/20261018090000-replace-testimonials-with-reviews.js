import { buildColumnHelpers, createTableWith } from './helpers/columns.js';

const ABOUT_TYPE_ENUM = 'enum_about_items_type';
const TYPES_WITHOUT_TESTIMONIAL = ['qualification', 'timeline', 'membership', 'stat', 'surgery'];
const TYPES_WITH_TESTIMONIAL = ['qualification', 'timeline', 'membership', 'stat', 'testimonial', 'surgery'];

const enumLiteral = (values) => values.map((value) => `'${value}'`).join(', ');

// Postgres cannot remove a value from an enum, so the type is recreated with the new list.
const replaceAboutTypeEnum = async (runSql, values) => {
  await runSql(`ALTER TYPE "${ABOUT_TYPE_ENUM}" RENAME TO "${ABOUT_TYPE_ENUM}_old"`);
  await runSql(`CREATE TYPE "${ABOUT_TYPE_ENUM}" AS ENUM (${enumLiteral(values)})`);
  await runSql(
    `ALTER TABLE about_items ALTER COLUMN type TYPE "${ABOUT_TYPE_ENUM}" USING type::text::"${ABOUT_TYPE_ENUM}"`,
  );
  await runSql(`DROP TYPE "${ABOUT_TYPE_ENUM}_old"`);
};

// Sample testimonials are replaced by reviews that patients submit and the doctor approves.
export async function up(queryInterface, Sequelize) {
  const column = buildColumnHelpers(Sequelize);

  await queryInterface.sequelize.transaction(async (transaction) => {
    const runSql = (sql) => queryInterface.sequelize.query(sql, { transaction });
    const createTable = createTableWith(queryInterface, column, transaction);

    await runSql(
      `DELETE FROM media_links WHERE owner_type = 'aboutItem'
         AND owner_id IN (SELECT id FROM about_items WHERE type = 'testimonial')`,
    );
    await runSql(`DELETE FROM about_items WHERE type = 'testimonial'`);
    await replaceAboutTypeEnum(runSql, TYPES_WITHOUT_TESTIMONIAL);
    await queryInterface.removeColumn('about_items', 'has_consent', { transaction });

    await createTable('reviews', {
      patient_name: column.text(60),
      city: column.text(60),
      rating: { type: Sequelize.SMALLINT, allowNull: false },
      comment: { type: Sequelize.TEXT, allowNull: true },
      status: {
        type: Sequelize.ENUM('pending', 'approved', 'rejected'),
        allowNull: false,
        defaultValue: 'pending',
      },
      is_featured: column.flag(false),
      // Normalised name and comment, used only to reject the same review sent twice.
      fingerprint: column.text(64),
      reviewed_at: { type: Sequelize.DATE, allowNull: true },
      reviewed_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    });
    await runSql('ALTER TABLE reviews ADD CONSTRAINT reviews_rating_check CHECK (rating BETWEEN 1 AND 5)');
    await queryInterface.addIndex('reviews', ['status', 'is_featured', 'created_at'], { transaction });
    await queryInterface.addIndex('reviews', ['fingerprint', 'created_at'], { transaction });
  });
}

// Restores the testimonial type and column; the deleted sample rows are not recreated.
export async function down(queryInterface, Sequelize) {
  await queryInterface.sequelize.transaction(async (transaction) => {
    const runSql = (sql) => queryInterface.sequelize.query(sql, { transaction });

    await queryInterface.dropTable('reviews', { transaction });
    await runSql('DROP TYPE IF EXISTS "enum_reviews_status"');
    await queryInterface.addColumn(
      'about_items',
      'has_consent',
      { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      { transaction },
    );
    await replaceAboutTypeEnum(runSql, TYPES_WITH_TESTIMONIAL);
  });
}
