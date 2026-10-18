import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import Joi from 'joi';
import sharp from 'sharp';
import { AboutItem, MediaLink } from '../models/index.js';
import { mediaLinkService } from '../services/mediaLink.service.js';
import { mediaService } from '../services/media.service.js';
import { aboutItemSchemas } from '../validators/about.validator.js';
import { removeBackground as removeWithModel } from './backgroundRemoval.js';
import { createCutout } from './cutout.js';
import { CONSENTED_FOLDER, ENTRIES, SOURCE_EXTENSIONS, entrySchema, resultEntry } from './manifest.js';

// Adds the photos in images-source/ to the media library (through the configured storage, so
// Cloudinary in production) and shows them where the manifest says. Each photo is imported once:
// a photo already in the library is skipped, together with where it is shown, so running the
// import again creates no copies and never undoes changes made from the dashboard since.

export const IMPORT_STATUS = Object.freeze({
  IMPORTED: 'imported',
  SKIPPED: 'skipped',
  MISSING: 'missing',
  FAILED: 'failed',
});

const isImageFile = (name) => SOURCE_EXTENSIONS.includes(path.extname(name).toLowerCase());

const listImages = async (dir) => {
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile() && isImageFile(entry.name))
      .map((entry) => entry.name)
      .toSorted();
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
};

// `source` has no extension; any accepted one matches, in any letter case.
const findSource = async (sourceDir, source) => {
  const folder = path.join(sourceDir, path.dirname(source));
  const name = (await listImages(folder)).find((file) => path.parse(file).name === path.basename(source));
  return name && path.join(folder, name);
};

const cropTo = async (buffer, { left, top, width, height }) => {
  const upright = await sharp(buffer).rotate().toBuffer();
  const { width: fullWidth, height: fullHeight } = await sharp(upright).metadata();
  return sharp(upright)
    .extract({
      left: Math.round(left * fullWidth),
      top: Math.round(top * fullHeight),
      width: Math.min(fullWidth, Math.round(width * fullWidth)),
      height: Math.min(fullHeight, Math.round(height * fullHeight)),
    })
    .png()
    .toBuffer();
};

// The image to store, and how it was made.
const prepare = async (entry, buffer, removeBackground) => {
  if (entry.crop) return { image: await cropTo(buffer, entry.crop), method: 'cropped' };
  if (!entry.cutout) return { image: buffer, method: 'original' };

  let problem = 'the cut-out did not come out clean';
  try {
    const cutout = await createCutout(buffer, { removeBackground, ...entry.cutout });
    if (cutout) return { image: cutout, method: 'cut-out' };
  } catch (error) {
    problem = `the background could not be removed (${error.message})`;
  }
  if (!entry.fallbackCrop) throw new Error(problem);
  return { image: await cropTo(buffer, entry.fallbackCrop), method: `framed photo, because ${problem}` };
};

// Saves where the photo is shown, in the same transaction as the photo's record.
const placeOnSite = (entry, notes) => async (media, transaction) => {
  if (entry.site) {
    const taken = await MediaLink.count({ where: { ownerType: 'site', ownerId: null, slot: entry.site }, transaction });
    if (taken) {
      notes.push(`${entry.site} already has an image, which was kept; choose this one from the dashboard if wanted`);
      return;
    }
    await mediaLinkService.replace('site', null, { [entry.site]: [media.id] }, transaction);
    notes.push(`shown as ${entry.site}`);
    return;
  }
  if (entry.item) {
    const { type, ...fields } = entry.item;
    const values = Joi.attempt(fields, aboutItemSchemas[type].full);
    const sortOrder = ((await AboutItem.max('sortOrder', { where: { type }, transaction })) ?? 0) + 1;
    const item = await AboutItem.create({ type, ...values, sortOrder }, { transaction });
    await mediaLinkService.replace('aboutItem', item.id, { gallery: [media.id] }, transaction);
    notes.push(`added to the ${type} list as "${values.titleEn}"`);
  }
};

const importEntry = async (entry, { sourceDir, removeBackground }) => {
  const file = await findSource(sourceDir, entry.source);
  if (!file) return { key: entry.key, status: IMPORT_STATUS.MISSING, notes: [`no ${entry.source} file was found`] };

  const notes = [];
  const { altAr, altEn, focus } = entry;
  try {
    const { media, created } = await mediaService.importImage({
      importKey: entry.key,
      details: { altAr, altEn, focusX: focus?.x ?? null, focusY: focus?.y ?? null },
      // Only called for photos not in the library yet, so the model runs once per photo.
      load: async () => {
        const { image, method } = await prepare(entry, await readFile(file), removeBackground);
        notes.push(method);
        return image;
      },
      link: placeOnSite(entry, notes),
    });
    if (!created) return { key: entry.key, status: IMPORT_STATUS.SKIPPED, notes: ['already in the media library'] };
    return { key: entry.key, status: IMPORT_STATUS.IMPORTED, mediaId: media.id, notes };
  } catch (error) {
    return { key: entry.key, status: IMPORT_STATUS.FAILED, notes: [...notes, error.message] };
  }
};

export const importImages = async ({ sourceDir, removeBackground = removeWithModel }) => {
  const consented = await listImages(path.join(sourceDir, CONSENTED_FOLDER));
  const entries = [...ENTRIES, ...consented.map(resultEntry)].map((entry) => Joi.attempt(entry, entrySchema));

  const results = [];
  for (const entry of entries) results.push(await importEntry(entry, { sourceDir, removeBackground }));

  const listed = new Set(ENTRIES.map(({ source }) => source));
  for (const name of await listImages(sourceDir)) {
    if (!listed.has(path.parse(name).name)) {
      results.push({ key: name, status: IMPORT_STATUS.SKIPPED, notes: ['not in the import list, so not imported'] });
    }
  }
  return results;
};

