import { sequelize } from '../models/index.js';

const ENGLISH_SUFFIX = 'En';

export const seedIfEmpty = async (
  Model,
  rows,
  createRow = (row, transaction) => Model.create(row, { transaction }),
) => {
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

// Adds the English sample text to rows seeded before English existed. A row is matched on
// `matchKeys` (still the sample values), and only English columns that are empty are filled.
export const fillMissingTranslations = async (Model, rows, matchKeys) => {
  let updated = 0;
  for (const row of rows) {
    const record = await Model.findOne({ where: Object.fromEntries(matchKeys.map((key) => [key, row[key]])) });
    const missing = Object.keys(row).filter((key) => key.endsWith(ENGLISH_SUFFIX) && row[key] && !record?.[key]);
    if (!record || !missing.length) continue;
    await record.update(Object.fromEntries(missing.map((key) => [key, row[key]])));
    updated += 1;
  }
  return updated;
};

export const seedTranslated = async (Model, rows, matchKeys, createRow) => {
  const result = await seedIfEmpty(Model, rows, createRow);
  const translated = await fillMissingTranslations(Model, rows, matchKeys);
  return translated ? `${result}; English added to ${translated} existing rows` : result;
};
