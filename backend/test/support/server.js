// Starts the API against a freshly prepared test database, for the browser tests.
import { prepareTestDatabase } from './database.js';

await prepareTestDatabase();
await import('../../src/server.js');
