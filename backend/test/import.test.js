import assert from 'node:assert/strict';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { after, before, describe, test } from 'node:test';
import sharp from 'sharp';
import { refineCutout } from '../src/imports/cutout.js';
import { IMPORT_STATUS, importImages } from '../src/imports/importImages.js';
import { AboutItem, Media, MediaLink } from '../src/models/index.js';
import { api, useTestServer } from './support/api.js';
import { createImage } from './support/images.js';

useTestServer();

const DARK = [40, 44, 52];
const BACKGROUND = [235, 245, 250];

// A person (head and shoulders reaching the bottom edge) with a light fringe left by the
// background, plus a separate red patch standing in for a logo the model kept.
const syntheticForeground = (width = 300, height = 400) => {
  const data = Buffer.alloc(width * height * 4);
  const isPerson = (x, y) => (x - 150) ** 2 + (y - 120) ** 2 <= 60 ** 2 || (x >= 60 && x < 240 && y >= 190);
  const isFringe = (x, y) => !isPerson(x, y) && [-2, 2].some((d) => isPerson(x + d, y) || isPerson(x, y + d));
  const isLogo = (x, y) => x >= 265 && x < 285 && y >= 20 && y < 40;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = (y * width + x) * 4;
      const [colour, alpha] = isPerson(x, y)
        ? [DARK, 255]
        : isLogo(x, y)
          ? [[220, 30, 30], 255]
          : isFringe(x, y)
            ? [BACKGROUND, 170]
            : [BACKGROUND, 0];
      data.set([...colour, alpha], index);
    }
  }
  return { data, width, height };
};

const pixelsOf = async (png) => {
  const { data, info } = await sharp(png).raw().toBuffer({ resolveWithObject: true });
  return { data, ...info };
};

describe('Portrait cut-out', () => {
  test('keeps only the person, with clean edges, in a square centred on the head', async () => {
    const cutout = await pixelsOf(await refineCutout(syntheticForeground()));
    assert.equal(cutout.width, cutout.height);
    assert.equal(cutout.channels, 4);

    let visible = 0;
    for (let index = 0; index < cutout.data.length; index += 4) {
      const [red, green, blue, alpha] = cutout.data.subarray(index, index + 4);
      if (!alpha) continue;
      visible += 1;
      assert.ok(red < 120 && green < 120 && blue < 120, `no logo or light halo: ${[red, green, blue, alpha]}`);
    }
    assert.ok(visible > 0);
    assert.equal(cutout.data[3], 0, 'the top corner is transparent');

    // The head is centred: its leftmost and rightmost pixels sit at the same distance from the edges.
    const row = Math.round(cutout.height * 0.25);
    const alphas = Array.from({ length: cutout.width }, (_, x) => cutout.data[(row * cutout.width + x) * 4 + 3]);
    const first = alphas.findIndex(Boolean);
    const last = alphas.findLastIndex(Boolean);
    assert.ok(Math.abs(first - (cutout.width - 1 - last)) <= 2);
  });

  test('gives up when the mask does not look like a person', async () => {
    const { width, height } = { width: 200, height: 200 };
    const data = Buffer.alloc(width * height * 4);
    data.set([200, 30, 30, 255], 0);
    assert.equal(await refineCutout({ data, width, height }), null);
  });
});

const writeImage = async (dir, name, options) => {
  const format = path.extname(name).slice(1).toLowerCase().replace('jpg', 'jpeg');
  await writeFile(path.join(dir, name), await createImage({ format, ...options }));
};

const siteSlot = (slot) => MediaLink.findOne({ where: { ownerType: 'site', ownerId: null, slot } });

const counts = async () => ({ media: await Media.count(), items: await AboutItem.count(), links: await MediaLink.count() });

const MANIFEST_KEYS = [
  'portrait-ad',
  'portrait-ad-cutout',
  'portrait-suit',
  'surgery-1',
  'surgery-endoscope',
  'result-ear-before-after',
  'result-nose-before-after',
];

describe('Photo import', () => {
  let sourceDir;
  let doctorPortrait;
  let backgroundRemovals = 0;
  const removeBackground = async () => {
    backgroundRemovals += 1;
    const { data, width, height } = syntheticForeground();
    return sharp(data, { raw: { width, height, channels: 4 } }).png().toBuffer();
  };

  before(async () => {
    sourceDir = await mkdtemp(path.join(os.tmpdir(), 'dr-hakim-images-'));
    await mkdir(path.join(sourceDir, 'consented'));
    await writeImage(sourceDir, 'portrait-ad.png', { width: 300, height: 400 });
    await writeImage(sourceDir, 'portrait-suit.jpg', { width: 812, height: 677 });
    await writeImage(sourceDir, 'surgery-1.webp', { width: 805, height: 607 });
    await writeImage(sourceDir, 'surgery-endoscope.png', { width: 632, height: 492 });
    await writeImage(sourceDir, 'another-poster.png');
    await writeImage(path.join(sourceDir, 'consented'), 'ear-before-after.png', { width: 448, height: 563 });
    await writeImage(path.join(sourceDir, 'consented'), 'nose-before-after.JPEG', { width: 452, height: 583 });
    await writeFile(path.join(sourceDir, 'consented', 'notes.txt'), 'not a photo');

    // The home page image is empty; the doctor already chose a portrait for the About page.
    await MediaLink.destroy({ where: { ownerType: 'site', slot: ['heroImage', 'portrait'] } });
    doctorPortrait = await Media.create({
      url: '/uploads/chosen.webp',
      storageKey: 'chosen',
      provider: 'local',
      width: 800,
      height: 1000,
      mimeType: 'image/webp',
      sizeBytes: 1000,
    });
    await MediaLink.create({ mediaId: doctorPortrait.id, ownerType: 'site', ownerId: null, slot: 'portrait' });
  });

  after(() => rm(sourceDir, { recursive: true, force: true }));

  test('adds each photo once and shows it where it belongs; running it again changes nothing', async () => {
    const first = await importImages({ sourceDir, removeBackground });
    const statusOf = (results, key) => results.find((result) => result.key === key)?.status;
    for (const key of MANIFEST_KEYS) assert.equal(statusOf(first, key), IMPORT_STATUS.IMPORTED, key);
    assert.equal(statusOf(first, 'another-poster.png'), IMPORT_STATUS.SKIPPED);
    assert.equal(backgroundRemovals, 1);

    const imported = await Media.findAll({ where: { importKey: MANIFEST_KEYS } });
    assert.equal(imported.length, MANIFEST_KEYS.length);
    const byKey = Object.fromEntries(imported.map((media) => [media.importKey, media]));

    const cutout = byKey['portrait-ad-cutout'];
    assert.equal(cutout.hasTransparency, true);
    assert.equal(cutout.width, cutout.height);
    assert.equal(byKey['portrait-ad'].hasTransparency, false, 'the original poster is kept as it was');
    assert.equal((await siteSlot('heroImage')).mediaId, cutout.id);
    assert.equal((await siteSlot('portrait')).mediaId, doctorPortrait.id, "the doctor's choice is kept");
    assert.match(first.find(({ key }) => key === 'portrait-suit').notes.join(' '), /already has an image/);

    const ear = byKey['result-ear-before-after'];
    assert.equal(ear.altAr, 'صورة قبل وبعد لعملية بالأذن');
    assert.equal(ear.altEn, 'Before and after photo of an ear procedure');
    assert.deepEqual([ear.focusX, ear.focusY], [50, 40]);

    const { body } = await api.get('/about', { query: { lang: 'en' } });
    const { profile, items } = body.data;
    assert.equal(profile.heroImage.id, cutout.id);
    assert.equal(profile.heroImage.alt, 'Dr. Abdelhakim Abdelsalam in a white coat');
    assert.deepEqual(
      items.result.map(({ title, category, gallery }) => [title, category, gallery[0].id]),
      [
        ['Ear procedure', 'ear', ear.id],
        ['Nose procedure', 'nose', byKey['result-nose-before-after'].id],
      ],
    );
    assert.deepEqual(
      items.surgery.map(({ gallery }) => gallery[0].id),
      [byKey['surgery-1'].id, byKey['surgery-endoscope'].id],
    );

    const before = await counts();
    const second = await importImages({ sourceDir, removeBackground });
    for (const key of MANIFEST_KEYS) assert.equal(statusOf(second, key), IMPORT_STATUS.SKIPPED, key);
    assert.deepEqual(await counts(), before);
    assert.equal(backgroundRemovals, 1, 'the model runs only for photos not imported yet');
  });

  test('photos missing from the folder are reported and nothing is added', async () => {
    const emptyDir = await mkdtemp(path.join(os.tmpdir(), 'dr-hakim-empty-'));
    try {
      const before = await counts();
      const results = await importImages({ sourceDir: emptyDir, removeBackground });
      assert.ok(results.length > 0);
      for (const { status } of results) assert.equal(status, IMPORT_STATUS.MISSING);
      assert.deepEqual(await counts(), before);
    } finally {
      await rm(emptyDir, { recursive: true, force: true });
    }
  });
});
