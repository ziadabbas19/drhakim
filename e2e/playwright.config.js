import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, devices } from '@playwright/test';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const API_PORT = 5055;
const WEB_PORT = 5175;
const WEB_URL = `http://127.0.0.1:${WEB_PORT}`;

// The API runs against a freshly prepared *_test database (see backend/test/support), and the
// website is the production build served by `vite preview`, proxying /api and /uploads to it.
export default defineConfig({
  testDir: './tests',
  // The tests share one database and change its content, so they run one at a time.
  workers: 1,
  fullyParallel: false,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  reporter: [['list']],
  outputDir: path.join(ROOT, 'test-results'),
  use: {
    baseURL: WEB_URL,
    trace: 'retain-on-failure',
  },
  projects: [
    // Checks the site as freshly seeded, before the other tests change its content.
    {
      name: 'fresh-site',
      testMatch: /fresh-site\.spec\.js/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'e2e',
      testIgnore: /(screenshots|fresh-site)\.spec\.js/,
      dependencies: ['fresh-site'],
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'screenshots',
      testMatch: /screenshots\.spec\.js/,
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: 'npm run test:server --prefix backend',
      cwd: ROOT,
      url: `http://127.0.0.1:${API_PORT}/api/health`,
      env: { PORT: String(API_PORT) },
      timeout: 120_000,
      reuseExistingServer: false,
    },
    {
      command: `npm run build --prefix frontend && npm run preview --prefix frontend -- --port ${WEB_PORT} --strictPort --host 127.0.0.1`,
      cwd: ROOT,
      url: WEB_URL,
      env: { VITE_PROXY_TARGET: `http://127.0.0.1:${API_PORT}`, VITE_SITE_URL: WEB_URL, VITE_API_URL: '/api' },
      timeout: 180_000,
      reuseExistingServer: false,
    },
  ],
});
