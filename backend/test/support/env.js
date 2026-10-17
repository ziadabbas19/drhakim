// Loaded before any app module (node --import): points the API at a separate test database and
// a temporary uploads folder, so tests never touch development data or real image storage.
import dotenv from 'dotenv';
import os from 'node:os';
import path from 'node:path';

dotenv.config({ quiet: true });

const TEST_SUFFIX = '_test';
const withTestSuffix = (name) => (name.endsWith(TEST_SUFFIX) ? name : `${name}${TEST_SUFFIX}`);

if (process.env.TEST_DATABASE_URL) {
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
} else if (process.env.DATABASE_URL) {
  const url = new URL(process.env.DATABASE_URL);
  url.pathname = `/${withTestSuffix(url.pathname.slice(1))}`;
  process.env.DATABASE_URL = url.toString();
} else {
  process.env.DB_NAME = withTestSuffix(process.env.DB_NAME || 'dr_hakim');
}

Object.assign(process.env, {
  NODE_ENV: 'test',
  STORAGE_PROVIDER: 'local',
  UPLOADS_DIR: process.env.TEST_UPLOADS_DIR || path.join(os.tmpdir(), 'dr-hakim-test-uploads'),
  MAX_UPLOAD_MB: '1',
  API_RATE_LIMIT_PER_15_MIN: '100000',
  BOOKING_RATE_LIMIT_PER_HOUR: '1000',
  REVIEW_RATE_LIMIT_PER_DAY: '3',
  REVIEW_PENDING_CAP: '25',
  // Lets the tests act as different visitors through X-Forwarded-For.
  TRUST_PROXY: '1',
  DB_LOGGING: 'false',
});
