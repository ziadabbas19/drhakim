import { Sequelize } from 'sequelize';
import { env } from './env.js';
import { CAIRO_TIME_ZONE } from './constants.js';

const connection = env.db.url
  ? { url: env.db.url }
  : {
      host: env.db.host,
      port: env.db.port,
      database: env.db.database,
      username: env.db.username,
      password: env.db.password,
    };

export const databaseConfig = {
  ...connection,
  dialect: 'postgres',
  timezone: CAIRO_TIME_ZONE,
  logging: env.db.logging ? console.log : false,
  dialectOptions: env.db.ssl ? { ssl: { require: true } } : {},
  define: { underscored: true },
  migrationStorageTableName: 'sequelize_meta',
};

const { url, ...options } = databaseConfig;

export const sequelize = url ? new Sequelize(url, options) : new Sequelize(options);
