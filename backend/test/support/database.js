import { spawnSync } from 'node:child_process';
import { rm } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';
import { databaseConfig } from '../../src/config/database.js';
import { env } from '../../src/config/env.js';
import { User, sequelize } from '../../src/models/index.js';
import { seedAbout } from '../../src/seeders/about.seeder.js';
import { seedClinics } from '../../src/seeders/clinics.seeder.js';
import { seedServices } from '../../src/seeders/services.seeder.js';
import { seedSettings } from '../../src/seeders/settings.seeder.js';
import { hashPassword } from '../../src/utils/password.js';
import { TEST_USERS } from './users.js';

const BACKEND_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const SEQUELIZE_CLI = createRequire(import.meta.url).resolve('sequelize-cli/lib/sequelize');
const SAFE_DATABASE_NAME = /^[\w-]+$/;

const maintenanceConnection = () => {
  if (!databaseConfig.url) {
    const { host, port, username: user, password, database } = databaseConfig;
    return { database, client: { host, port, user, password, database: 'postgres' } };
  }
  const url = new URL(databaseConfig.url);
  const database = url.pathname.slice(1);
  url.pathname = '/postgres';
  return { database, client: { connectionString: url.toString(), ssl: databaseConfig.dialectOptions.ssl } };
};

const ensureDatabaseExists = async () => {
  const { database, client: options } = maintenanceConnection();
  if (!SAFE_DATABASE_NAME.test(database)) throw new Error(`Unexpected test database name: ${database}`);

  const client = new pg.Client(options);
  await client.connect();
  try {
    const { rowCount } = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [database]);
    if (!rowCount) await client.query(`CREATE DATABASE "${database}"`);
  } finally {
    await client.end();
  }
};

const runCli = (...args) => {
  const result = spawnSync(process.execPath, [SEQUELIZE_CLI, ...args], {
    cwd: BACKEND_ROOT,
    env: process.env,
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    throw new Error(`sequelize-cli ${args.join(' ')} failed:\n${result.stdout}\n${result.stderr}`);
  }
};

const createTestUsers = async () => {
  for (const { password, ...user } of Object.values(TEST_USERS)) {
    await User.create({ ...user, passwordHash: await hashPassword(password), mustChangePassword: false });
  }
};

const TEST_DATABASE_SUFFIX = '_test';

// The reset below deletes everything, so it refuses to run anywhere but a *_test database.
const assertTestDatabase = async () => {
  const [[{ name }]] = await sequelize.query('SELECT current_database() AS name');
  if (process.env.NODE_ENV !== 'test' || !name.endsWith(TEST_DATABASE_SUFFIX)) {
    throw new Error(
      `Refusing to reset "${name}": tests only run against a database ending in "${TEST_DATABASE_SUFFIX}"`,
    );
  }
};

// Rebuilds the test database from the migrations (rolling the latest one back and forth to check
// that it is reversible), then loads the sample content and the test accounts.
export const prepareTestDatabase = async () => {
  if (!maintenanceConnection().database.endsWith(TEST_DATABASE_SUFFIX)) {
    throw new Error('The test environment was not loaded; refusing to touch a non-test database');
  }
  await ensureDatabaseExists();
  await assertTestDatabase();
  await sequelize.query('DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public;');
  runCli('db:migrate');
  runCli('db:migrate:undo');
  runCli('db:migrate');

  for (const seed of [seedClinics, seedServices, seedSettings, seedAbout]) await seed();
  await createTestUsers();
  await rm(env.storage.uploadsDir, { recursive: true, force: true });
};
