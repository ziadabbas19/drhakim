import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env } from './config/env.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFound } from './middlewares/notFound.js';
import { apiLimiter } from './middlewares/rateLimiters.js';
import routes from './routes/index.js';
import { ACCESS_TOKEN_HEADER } from './utils/token.js';

export const app = express();

app.set('trust proxy', env.trustProxy);
app.use(helmet());
app.use(cors({ origin: env.clientOrigins, exposedHeaders: [ACCESS_TOKEN_HEADER] }));
app.use(express.json({ limit: '20kb' }));

app.use('/api', apiLimiter, routes);
app.use(notFound);
app.use(errorHandler);
