import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { MEDIA } from '../config/constants.js';

export const UPLOADS_ROUTE = '/uploads';

const fileName = (key, width) => (width ? `${key}-${width}.webp` : `${key}.webp`);

// Development storage: files on disk, served by the API under /uploads.
export const createLocalProvider = ({ uploadsDir }) => {
  const write = async (name, buffer) => {
    await writeFile(path.join(uploadsDir, name), buffer);
    return `${UPLOADS_ROUTE}/${name}`;
  };

  return {
    name: 'local',

    async upload({ key, buffer, width, variants }) {
      await mkdir(uploadsDir, { recursive: true });
      const url = await write(fileName(key), buffer);
      const smaller = [];
      for (const variant of variants) {
        smaller.push({ width: variant.width, url: await write(fileName(key, variant.width), await variant.render()) });
      }
      return { storageKey: key, url, variants: [...smaller, { width, url }] };
    },

    async remove(key) {
      const names = [fileName(key), ...MEDIA.variantWidths.map((width) => fileName(key, width))];
      await Promise.all(names.map((name) => rm(path.join(uploadsDir, name), { force: true })));
    },
  };
};
