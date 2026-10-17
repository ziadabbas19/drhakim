// Runs once, before every test file. The test environment is loaded here explicitly because the
// runner can evaluate this module before the --import preload has finished.
import './env.js';

export async function globalSetup() {
  const { prepareTestDatabase } = await import('./database.js');
  const { sequelize } = await import('../../src/models/index.js');
  try {
    await prepareTestDatabase();
  } finally {
    await sequelize.close();
  }
}
