import { sequelize } from '../models/index.js';

export const seedIfEmpty = async (Model, rows, createRow = (row, transaction) => Model.create(row, { transaction })) => {
  if (await Model.count()) return `${Model.tableName}: already has data, skipped`;

  await sequelize.transaction(async (transaction) => {
    for (const row of rows) {
      await createRow(row, transaction);
    }
  });
  return `${Model.tableName}: ${rows.length} rows created`;
};

export const createMissing = async (Model, rows, uniqueKey) => {
  let created = 0;
  for (const row of rows) {
    const [, isNew] = await Model.findOrCreate({ where: { [uniqueKey]: row[uniqueKey] }, defaults: row });
    created += Number(isNew);
  }
  return created;
};
