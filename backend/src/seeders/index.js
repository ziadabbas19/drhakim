import { sequelize } from '../models/index.js';
import { seedClinics } from './clinics.seeder.js';
import { seedOwners } from './owners.seeder.js';
import { seedServices } from './services.seeder.js';
import { seedSettings } from './settings.seeder.js';

const seeders = [seedOwners, seedClinics, seedServices, seedSettings];

try {
  for (const seed of seeders) {
    console.log(await seed());
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await sequelize.close();
}
