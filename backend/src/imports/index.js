// npm run import:images [folder]: adds the doctor's photos to the media library. The database
// and the image storage come from the environment (.env), so running it with the production
// settings uploads to Cloudinary and updates the production database. Safe to run again.
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { env } from '../config/env.js';
import { sequelize } from '../models/index.js';
import { IMPORT_STATUS, importImages } from './importImages.js';

const DEFAULT_SOURCE = fileURLToPath(new URL('../../../images-source', import.meta.url));

const sourceDir = path.resolve(process.argv[2] ?? DEFAULT_SOURCE);
const database = env.db.url ? 'the DATABASE_URL database' : `"${env.db.database}" on ${env.db.host}:${env.db.port}`;

try {
  console.log(`Importing photos from ${sourceDir}`);
  console.log(`Database: ${database}; image storage: ${env.storage.provider}`);
  const results = await importImages({ sourceDir });
  for (const { key, status, notes } of results) console.log(`- ${key}: ${status}${notes.length ? ` (${notes.join('; ')})` : ''}`);
  if (results.some(({ status }) => status === IMPORT_STATUS.FAILED)) process.exitCode = 1;
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await sequelize.close();
}
