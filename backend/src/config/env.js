import 'dotenv/config';
import path from 'node:path';
import Joi from 'joi';
import { normalizeEmail } from '../utils/normalize.js';

const splitList = (value) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const BYTES_PER_MB = 1024 * 1024;

const requiredForCloudinary = Joi.string().when('STORAGE_PROVIDER', {
  is: 'cloudinary',
  then: Joi.required(),
  otherwise: Joi.allow('').default(''),
});

const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().port().default(5000),
  CLIENT_ORIGIN: Joi.string().default('http://localhost:5173'),
  TRUST_PROXY: Joi.number().integer().min(0).default(0),
  API_RATE_LIMIT_PER_15_MIN: Joi.number().integer().min(1).default(600),
  BOOKING_RATE_LIMIT_PER_HOUR: Joi.number().integer().min(1).default(10),
  REVIEW_RATE_LIMIT_PER_DAY: Joi.number().integer().min(1).default(3),
  REVIEW_PENDING_CAP: Joi.number().integer().min(1).default(200),
  DATABASE_URL: Joi.string()
    .uri({ scheme: ['postgres', 'postgresql'] })
    .allow('')
    .default(''),
  DB_HOST: Joi.string().default('localhost'),
  DB_PORT: Joi.number().port().default(5432),
  DB_NAME: Joi.string().default('dr_hakim'),
  DB_USER: Joi.string().default('postgres'),
  DB_PASSWORD: Joi.string().allow('').default(''),
  DB_SSL: Joi.boolean().default(false),
  DB_LOGGING: Joi.boolean().default(false),
  JWT_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRES_IN: Joi.string().default('2h'),
  OWNER_EMAILS: Joi.string().allow('').default(''),
  OWNER_INITIAL_PASSWORD: Joi.string().allow('').default(''),
  STORAGE_PROVIDER: Joi.string().valid('local', 'cloudinary').default('local'),
  UPLOADS_DIR: Joi.string().default('uploads'),
  MAX_UPLOAD_MB: Joi.number().positive().max(50).default(5),
  CLOUDINARY_CLOUD_NAME: requiredForCloudinary,
  CLOUDINARY_API_KEY: requiredForCloudinary,
  CLOUDINARY_API_SECRET: requiredForCloudinary,
  CLOUDINARY_FOLDER: Joi.string().default('dr-hakim'),
}).unknown();

const { value, error } = envSchema.validate(process.env, { abortEarly: false });

if (error) {
  throw new Error(`Invalid environment variables: ${error.message}`);
}

export const env = Object.freeze({
  port: value.PORT,
  clientOrigins: splitList(value.CLIENT_ORIGIN),
  trustProxy: value.TRUST_PROXY,
  apiRateLimitPer15Min: value.API_RATE_LIMIT_PER_15_MIN,
  bookingRateLimitPerHour: value.BOOKING_RATE_LIMIT_PER_HOUR,
  reviews: {
    rateLimitPerDay: value.REVIEW_RATE_LIMIT_PER_DAY,
    pendingCap: value.REVIEW_PENDING_CAP,
  },
  db: {
    url: value.DATABASE_URL,
    host: value.DB_HOST,
    port: value.DB_PORT,
    database: value.DB_NAME,
    username: value.DB_USER,
    password: value.DB_PASSWORD,
    ssl: value.DB_SSL,
    logging: value.DB_LOGGING,
  },
  jwt: {
    secret: value.JWT_SECRET,
    expiresIn: value.JWT_EXPIRES_IN,
  },
  owners: {
    emails: splitList(value.OWNER_EMAILS).map(normalizeEmail),
    initialPassword: value.OWNER_INITIAL_PASSWORD,
  },
  storage: {
    provider: value.STORAGE_PROVIDER,
    uploadsDir: path.resolve(value.UPLOADS_DIR),
    cloudinary: {
      cloudName: value.CLOUDINARY_CLOUD_NAME,
      apiKey: value.CLOUDINARY_API_KEY,
      apiSecret: value.CLOUDINARY_API_SECRET,
      folder: value.CLOUDINARY_FOLDER,
    },
  },
  uploads: {
    maxMegabytes: value.MAX_UPLOAD_MB,
    maxBytes: Math.floor(value.MAX_UPLOAD_MB * BYTES_PER_MB),
  },
});
