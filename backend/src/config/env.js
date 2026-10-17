import 'dotenv/config';
import Joi from 'joi';
import { normalizeEmail } from '../utils/normalize.js';

const splitList = (value) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().port().default(5000),
  CLIENT_ORIGIN: Joi.string().default('http://localhost:5173'),
  TRUST_PROXY: Joi.number().integer().min(0).default(0),
  BOOKING_RATE_LIMIT_PER_HOUR: Joi.number().integer().min(1).default(10),
  DATABASE_URL: Joi.string().uri({ scheme: ['postgres', 'postgresql'] }).allow('').default(''),
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
}).unknown();

const { value, error } = envSchema.validate(process.env, { abortEarly: false });

if (error) {
  throw new Error(`Invalid environment variables: ${error.message}`);
}

export const env = Object.freeze({
  port: value.PORT,
  clientOrigins: splitList(value.CLIENT_ORIGIN),
  trustProxy: value.TRUST_PROXY,
  bookingRateLimitPerHour: value.BOOKING_RATE_LIMIT_PER_HOUR,
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
});
