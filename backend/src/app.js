import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env } from './config/env.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { resolveLanguage } from './middlewares/language.js';
import { notFound } from './middlewares/notFound.js';
import { apiLimiter } from './middlewares/rateLimiters.js';
import routes from './routes/index.js';
import { UPLOADS_ROUTE } from './storage/local.provider.js';
import { ACCESS_TOKEN_HEADER } from './utils/token.js';

const JSON_BODY_LIMIT = '100kb';

export const app = express();

app.set('trust proxy', env.trustProxy);
app.use(helmet());
app.use(cors({ origin: env.clientOrigins, exposedHeaders: [ACCESS_TOKEN_HEADER] }));
app.use(express.json({ limit: JSON_BODY_LIMIT }));

// Local storage is for development; file names are unique, so they can be cached forever.
if (env.storage.provider === 'local') {
  app.use(
    UPLOADS_ROUTE,
    express.static(env.storage.uploadsDir, {
      immutable: true,
      maxAge: '1y',
      index: false,
      setHeaders: (res) => res.set('Cross-Origin-Resource-Policy', 'cross-origin'),
    }),
  );
}

app.use('/api', resolveLanguage, apiLimiter, routes);
app.use(notFound);
app.use(errorHandler);
