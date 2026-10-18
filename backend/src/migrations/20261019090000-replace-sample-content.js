import { ABOUT_ITEMS, CLINICS, SERVICES, SETTING_VALUES } from '../seeders/content.js';
import { SAMPLE_ABOUT_ITEMS, SAMPLE_CLINICS, SAMPLE_SERVICES, SAMPLE_SETTINGS } from './helpers/sampleContent.js';

// Replaces the invented sample content of earlier seeds with the doctor's confirmed details on a
// database that was already seeded. Only what nobody has edited is changed:
// - a sample service or About item is deleted while its text is exactly the sample text and no
//   image was added to it; the confirmed rows are then added, except where a row with the same
//   title is already there;
// - a setting, or a clinic's name, city, address, phone, or map link, is replaced while it still
//   holds the sample value;
// - a clinic's weekly schedule is removed while it is exactly the sample schedule.
// Bookings are never changed. On an empty database there is nothing to replace; `npm run seed`
// fills it with the confirmed content.

const ABOUT_FIELDS = ['titleAr', 'titleEn', 'subtitleAr', 'subtitleEn', 'bodyAr', 'bodyEn', 'value', 'category'];
const SERVICE_FIELDS = ['titleAr', 'titleEn', 'descriptionAr', 'descriptionEn', 'icon'];
const CLINIC_TEXT_FIELDS = ['name', 'city', 'address'];
const CLINIC_PLAIN_FIELDS = ['phone', 'mapUrl'];

const snakeCase = (key) => key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
const toColumns = (record) => Object.fromEntries(Object.entries(record).map(([key, value]) => [snakeCase(key), value]));
const isBlank = (value) => value === null || value === undefined || value === '';

// English may still be empty on databases seeded before English existed.
const holdsSample = (row, sample, field) => {
  const value = row[snakeCase(field)];
  if (isBlank(value)) return isBlank(sample[field]) || field.endsWith('En');
  return String(value) === String(sample[field]);
};

const holdsSamplePair = (row, sample, name) =>
  holdsSample(row, sample, `${name}Ar`) && holdsSample(row, sample, `${name}En`);

// Postgres returns times as HH:mm:ss.
const rangeKeys = (ranges) =>
  ranges
    .map(({ dayOfWeek, startTime, endTime }) => `${dayOfWeek} ${startTime.slice(0, 5)}-${endTime.slice(0, 5)}`)
    .toSorted()
    .join();

const isSampleSchedule = (rows, sampleRanges) =>
  rows.length > 0 &&
  rangeKeys(rows.map((row) => ({ dayOfWeek: row.day_of_week, startTime: row.start_time, endTime: row.end_time }))) ===
    rangeKeys(sampleRanges);

const databaseFor = (queryInterface, Sequelize, transaction) => ({
  select: (sql, replacements = {}) =>
    queryInterface.sequelize.query(sql, { replacements, transaction, type: Sequelize.QueryTypes.SELECT }),
  insert: (table, rows) => queryInterface.bulkInsert(table, rows.map(toColumns), { transaction }),
  update: (table, values, id) =>
    queryInterface.bulkUpdate(table, { ...values, updated_at: new Date() }, { id }, { transaction }),
  remove: (table, where) => queryInterface.bulkDelete(table, where, { transaction }),
});

const hasImages = async (db, ownerType, ownerId) =>
  (
    await db.select('SELECT 1 FROM media_links WHERE owner_type = :ownerType AND owner_id = :ownerId LIMIT 1', {
      ownerType,
      ownerId,
    })
  ).length > 0;

// `scope` separates lists that share a table (About items of each type).
const replaceListRows = async (db, { table, ownerType, fields, samples, rows, scope }) => {
  const existing = await db.select(`SELECT * FROM ${table}`);
  if (!existing.length) return;

  const inScope = (first, second) => !scope || first[scope] === second[scope];
  const isUntouchedSample = (row) =>
    samples.some((sample) => inScope(row, sample) && fields.every((field) => holdsSample(row, sample, field)));

  const removed = [];
  for (const row of existing) {
    if (isUntouchedSample(row) && !(await hasImages(db, ownerType, row.id))) removed.push(row.id);
  }
  if (removed.length) await db.remove(table, { id: removed });

  const remaining = existing.filter((row) => !removed.includes(row.id));
  const additions = [];
  for (const row of rows) {
    const peers = remaining.filter((other) => inScope(other, row));
    const added = additions.filter((other) => inScope(other, row));
    if (peers.some((other) => other.title_ar === row.titleAr)) continue;
    const sortOrders = [...peers.map((other) => other.sort_order), ...added.map((other) => other.sortOrder)];
    additions.push({ ...row, sortOrder: Math.max(0, ...sortOrders) + 1 });
  }
  if (additions.length) await db.insert(table, additions);
};

const replaceSettings = async (db) => {
  for (const [key, sample] of Object.entries(SAMPLE_SETTINGS)) {
    const [row] = await db.select('SELECT * FROM site_settings WHERE key = :key', { key });
    if (!row || !holdsSamplePair(row, sample, 'value')) continue;
    const { valueAr = '', valueEn = null } = SETTING_VALUES[key] ?? {};
    await db.update('site_settings', { value_ar: valueAr, value_en: valueEn }, row.id);
  }
};

// The sample clinics and the confirmed ones are listed in the same order.
const replaceClinics = async (db) => {
  for (const [index, sample] of SAMPLE_CLINICS.entries()) {
    const clinic = CLINICS[index];
    const rows = await db.select('SELECT * FROM clinics WHERE name_ar = :name OR address_ar = :address', {
      name: sample.nameAr,
      address: sample.addressAr,
    });

    for (const row of rows) {
      const replaced = [
        ...CLINIC_TEXT_FIELDS.filter((name) => holdsSamplePair(row, sample, name)).flatMap((name) => [
          `${name}Ar`,
          `${name}En`,
        ]),
        ...CLINIC_PLAIN_FIELDS.filter((field) => holdsSample(row, sample, field)),
      ].filter((field) => row[snakeCase(field)] !== clinic[field]);
      if (replaced.length) {
        await db.update('clinics', toColumns(Object.fromEntries(replaced.map((field) => [field, clinic[field]]))), row.id);
      }

      const schedules = await db.select('SELECT * FROM clinic_schedules WHERE clinic_id = :id', { id: row.id });
      if (isSampleSchedule(schedules, sample.schedules)) await db.remove('clinic_schedules', { clinic_id: row.id });
    }
  }
};

export async function up(queryInterface, Sequelize) {
  await queryInterface.sequelize.transaction(async (transaction) => {
    const db = databaseFor(queryInterface, Sequelize, transaction);
    await replaceListRows(db, {
      table: 'about_items',
      ownerType: 'aboutItem',
      fields: ABOUT_FIELDS,
      samples: SAMPLE_ABOUT_ITEMS,
      rows: ABOUT_ITEMS,
      scope: 'type',
    });
    await replaceListRows(db, {
      table: 'services',
      ownerType: 'service',
      fields: SERVICE_FIELDS,
      samples: SAMPLE_SERVICES,
      rows: SERVICES,
    });
    await replaceSettings(db);
    await replaceClinics(db);
  });
}

// The sample content is not restored: it was never real.
export async function down() {}
