import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { Sequelize } from 'sequelize';
import { up as replaceSampleContent } from '../src/migrations/20261019090000-replace-sample-content.js';
import {
  SAMPLE_ABOUT_ITEMS,
  SAMPLE_CLINICS,
  SAMPLE_SERVICES,
  SAMPLE_SETTINGS,
} from '../src/migrations/helpers/sampleContent.js';
import {
  AboutItem,
  Booking,
  Clinic,
  ClinicSchedule,
  Media,
  MediaLink,
  Service,
  SiteSetting,
  sequelize,
} from '../src/models/index.js';
import { ABOUT_ITEMS, CLINICS, DOCTOR_PHONE, SERVICES, SETTING_VALUES } from '../src/seeders/content.js';
import { useTestServer } from './support/api.js';

useTestServer();

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

// Everything that holds the site's facts: the seeds, the static site content, both apps'
// translations, the page tags, and the structured data for search engines.
const SCANNED = [
  'backend/src/seeders',
  'backend/src/i18n',
  'frontend/src/config/content.js',
  'frontend/src/i18n',
  'frontend/index.html',
  'frontend/src/utils/structuredData.js',
  'frontend/src/features/reviews/ReviewsSummary.jsx',
];

// Invented details from the earlier sample content, beyond its full texts below.
const REMOVED_FACTS = [
  '+18',
  '+6,000',
  '+30,000',
  'ثمانية عشر',
  'eighteen',
  'آلاف العمليات',
  'thousands of operations',
  'استشاري',
  'onsultant',
  'طنطا',
  'Tanta',
  'MBBCh',
  'دكتوراه',
  'Doctorate',
  'نقابة أطباء',
  'Medical Syndicate',
  'الأكاديمية الأمريكية',
  'American Academy',
  'Coblation',
  'Tonsillectomy',
  'Septoplasty',
  'Tympanoplasty',
  'Adenoidectomy',
  'مستشفيات خاصة',
  'private hospitals',
  'شارع المحطة',
  'El-Mahatta',
  'مكرم عبيد',
  'Makram Ebeid',
  'مدينة نصر',
  'Nasr City',
  'الغربية',
  'Gharbia',
  '01001234567',
  '0403461275',
  '0224017733',
  // Claims of the earlier home page, services, and booking texts.
  'بأحدث تقنيات',
  'latest endoscopic',
  'جراحات المناظير الحديثة',
  'Modern endoscopic surgery',
  'متابعة دقيقة',
  'Close follow-up',
  'close follow-up',
  'التعافي الكامل',
  'full recovery',
  'بعشر دقائق',
  'ten minutes before',
  'التشخيص الصحيح',
  'the right diagnosis',
  'في أقل من دقيقة',
  'in under a minute',
  'خلال دقيقة واحدة',
];

const LONG_TEXT = 12;

const textsOf = (value) =>
  typeof value === 'string' ? [value] : value && typeof value === 'object' ? Object.values(value).flatMap(textsOf) : [];

const CONFIRMED_TEXT = textsOf([CLINICS, SERVICES, SETTING_VALUES, ABOUT_ITEMS]).join('\n');

// The sample clinics' names were real and are kept; their cities, addresses, and phones were not.
// A sample phrase that is also a confirmed fact (such as "ENT specialist") is not a removed one.
const sampleTexts = () => [
  ...textsOf(SAMPLE_CLINICS.map(({ nameAr, nameEn, ...invented }) => invented)),
  ...textsOf(SAMPLE_SERVICES.map(({ icon, ...texts }) => texts)),
  ...textsOf(SAMPLE_SETTINGS).flatMap((html) => html.split(/<\/?p>/)),
  ...textsOf(SAMPLE_ABOUT_ITEMS.map(({ type, category, ...texts }) => texts)),
].filter((text) => text.length >= LONG_TEXT && !CONFIRMED_TEXT.includes(text));

const filesUnder = async (target) => {
  const full = path.join(ROOT, target);
  if (path.extname(full)) return [full];
  const entries = await readdir(full, { withFileTypes: true, recursive: true });
  return entries.filter((entry) => entry.isFile()).map((entry) => path.join(entry.parentPath, entry.name));
};

describe('Site content', () => {
  test('no removed sample fact is left in the seeds, content, translations, page tags, or structured data', async () => {
    const phrases = [...REMOVED_FACTS, ...sampleTexts()];
    const found = [];
    for (const file of (await Promise.all(SCANNED.map(filesUnder))).flat()) {
      const source = await readFile(file, 'utf8');
      for (const phrase of phrases) {
        if (source.includes(phrase)) found.push(`${path.relative(ROOT, file)}: ${phrase}`);
      }
    }
    assert.deepEqual(found, []);
  });

  test('clinics are seeded without hours and with the doctor’s number', () => {
    for (const clinic of CLINICS) {
      assert.equal('schedules' in clinic, false);
      assert.equal(clinic.phone, DOCTOR_PHONE);
    }
    assert.equal(SETTING_VALUES.doctorPhone.valueAr, DOCTOR_PHONE);
    assert.equal(SETTING_VALUES.whatsappNumber.valueAr, DOCTOR_PHONE);
  });
});

const sampleOf = (type) => SAMPLE_ABOUT_ITEMS.find((item) => item.type === type);
const pickSetting = (key) => SiteSetting.findOne({ where: { key } });
const runMigration = () => replaceSampleContent(sequelize.getQueryInterface(), Sequelize);

// A database seeded by an earlier version: some sample rows untouched, others edited by the doctor.
const seedEarlierSample = async () => {
  const { schedules, ...cairo } = SAMPLE_CLINICS[1];
  const photo = await Media.create({
    url: '/uploads/doctor-photo.webp',
    storageKey: 'doctor-photo',
    provider: 'local',
    width: 800,
    height: 600,
    mimeType: 'image/webp',
    sizeBytes: 1000,
  });
  const rows = {
    untouchedService: await Service.create({ ...SAMPLE_SERVICES[0], isFeatured: true, sortOrder: 90 }),
    editedService: await Service.create({
      ...SAMPLE_SERVICES[1],
      descriptionAr: 'وصف كتبه الدكتور بنفسه للخدمة',
      sortOrder: 91,
    }),
    // Seeded before English existed.
    untouchedStat: await AboutItem.create({ ...sampleOf('stat'), titleEn: null, sortOrder: 90 }),
    surgeryWithPhoto: await AboutItem.create({ ...sampleOf('surgery'), sortOrder: 90 }),
    clinic: await Clinic.create({ ...cairo, phone: '0221234567', sortOrder: 90 }),
    photo,
  };
  await MediaLink.create({ mediaId: photo.id, ownerType: 'aboutItem', ownerId: rows.surgeryWithPhoto.id, slot: 'gallery' });
  await ClinicSchedule.bulkCreate(schedules.map((range) => ({ ...range, clinicId: rows.clinic.id })));
  rows.booking = await Booking.create({
    referenceCode: 'HK-SAMPLE',
    clinicId: rows.clinic.id,
    date: '2030-01-06',
    time: '12:00',
    patientName: 'مريض تجريبي',
    phone: '01012345678',
  });

  await (await pickSetting('doctorPhone')).update({ valueAr: SAMPLE_SETTINGS.doctorPhone.valueAr });
  await (await pickSetting('workingHoursNote')).update({
    valueAr: SAMPLE_SETTINGS.workingHoursNote.valueAr,
    valueEn: null,
  });
  await (await pickSetting('intro')).update({ valueAr: 'مقدمة كتبها الدكتور', valueEn: '' });
  return rows;
};

const restoreSeeded = async (rows) => {
  await rows.booking.destroy();
  await MediaLink.destroy({ where: { mediaId: rows.photo.id } });
  await rows.photo.destroy();
  await AboutItem.destroy({ where: { id: [rows.untouchedStat.id, rows.surgeryWithPhoto.id] } });
  await Service.destroy({ where: { id: [rows.untouchedService.id, rows.editedService.id] } });
  await rows.clinic.destroy();
  for (const key of ['doctorPhone', 'workingHoursNote', 'intro']) {
    const { valueAr = '', valueEn = null } = SETTING_VALUES[key] ?? {};
    await (await pickSetting(key)).update({ valueAr, valueEn });
  }
};

describe('Replacing the earlier sample content', () => {
  test('replaces what nobody edited and keeps what the doctor changed', async () => {
    const seededClinic = (await Clinic.findOne({ where: { addressAr: CLINICS[1].addressAr } })).toJSON();
    const rows = await seedEarlierSample();
    try {
      await runMigration();

      assert.equal(await Service.findByPk(rows.untouchedService.id), null);
      assert.equal((await Service.findByPk(rows.editedService.id)).descriptionAr, 'وصف كتبه الدكتور بنفسه للخدمة');
      assert.equal(await AboutItem.findByPk(rows.untouchedStat.id), null);
      assert.ok(await AboutItem.findByPk(rows.surgeryWithPhoto.id), 'an item with a photo counts as edited');

      const clinic = await Clinic.findByPk(rows.clinic.id);
      assert.equal(clinic.addressAr, CLINICS[1].addressAr);
      assert.equal(clinic.addressEn, CLINICS[1].addressEn);
      assert.equal(clinic.mapUrl, CLINICS[1].mapUrl);
      assert.equal(clinic.phone, '0221234567', 'the phone was changed, so it is kept');
      assert.equal(await ClinicSchedule.count({ where: { clinicId: clinic.id } }), 0);
      assert.ok(await Booking.findByPk(rows.booking.id), 'bookings are never changed');

      assert.equal((await pickSetting('doctorPhone')).valueAr, DOCTOR_PHONE);
      assert.equal((await pickSetting('workingHoursNote')).valueAr, '');
      assert.equal((await pickSetting('intro')).valueAr, 'مقدمة كتبها الدكتور');

      const seededAfter = (await Clinic.findByPk(seededClinic.id)).toJSON();
      assert.deepEqual(seededAfter, seededClinic, 'confirmed content is left as it is');
      assert.equal(await Service.count({ where: { titleAr: SERVICES[0].titleAr } }), 1);
    } finally {
      await restoreSeeded(rows);
    }
  });

  test('adds a confirmed item missing from a seeded list once, however often it runs', async () => {
    const membership = ABOUT_ITEMS.find(({ type }) => type === 'membership');
    const existing = await AboutItem.findOne({ where: { type: 'membership', titleAr: membership.titleAr } });
    await existing.destroy();

    await runMigration();
    await runMigration();

    const added = await AboutItem.findAll({ where: { type: 'membership', titleAr: membership.titleAr } });
    assert.equal(added.length, 1);
    assert.equal(added[0].titleEn, membership.titleEn);
  });
});
