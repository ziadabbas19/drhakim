import { app } from './app.js';
import { sequelize } from './config/database.js';
import { env } from './config/env.js';

await sequelize.authenticate();

const server = app.listen(env.port, () => {
  console.log(`API running on http://localhost:${env.port}/api`);
});

const shutdown = () => {
  server.close(async () => {
    await sequelize.close();
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
