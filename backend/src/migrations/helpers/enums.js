export const ABOUT_ITEM_TYPE_ENUM = Object.freeze({ type: 'enum_about_items_type', table: 'about_items', column: 'type' });

const enumLiteral = (values) => values.map((value) => `'${value}'`).join(', ');

// Postgres cannot remove a value from an enum, so the type is recreated with the new list.
export const replaceEnum = async (runSql, { type, table, column }, values) => {
  await runSql(`ALTER TYPE "${type}" RENAME TO "${type}_old"`);
  await runSql(`CREATE TYPE "${type}" AS ENUM (${enumLiteral(values)})`);
  await runSql(`ALTER TABLE ${table} ALTER COLUMN ${column} TYPE "${type}" USING ${column}::text::"${type}"`);
  await runSql(`DROP TYPE "${type}_old"`);
};
