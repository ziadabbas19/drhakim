import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { TEST_USERS } from '../backend/test/support/users.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sharp = createRequire(path.join(ROOT, 'backend', 'package.json'))('sharp');

export const STORAGE_KEYS = Object.freeze({ language: 'dr-hakim:language', theme: 'dr-hakim:theme' });

export const pngFile = async (name, { width = 900, height = 600, color = '#1c8193' } = {}) => ({
  name,
  mimeType: 'image/png',
  buffer: await sharp({ create: { width, height, channels: 3, background: color } })
    .png()
    .toBuffer(),
});

// Saved preferences applied before any page script runs, like a returning visitor.
export const presetPreferences = (context, preferences) =>
  context.addInitScript(
    ({ keys, values }) => {
      for (const [name, value] of Object.entries(values)) localStorage.setItem(keys[name], value);
    },
    { keys: STORAGE_KEYS, values: preferences },
  );

export const login = async (page, role = 'owner') => {
  const { email, password } = TEST_USERS[role];
  await page.goto('/login');
  await page.getByLabel(/البريد الإلكتروني|Email/).fill(email);
  await page.getByLabel(/كلمة المرور|Password/).fill(password);
  await page.getByRole('button', { name: /تسجيل الدخول|Sign in/ }).click();
  await page.waitForURL(/\/dashboard\//);
};

// Calls the admin API directly, for setting up data that a test only needs to look at.
export const adminRequest = async (request, role = 'owner') => {
  const { email, password } = TEST_USERS[role];
  const { data } = await (await request.post('/api/auth/login', { data: { email, password } })).json();
  const headers = { Authorization: `Bearer ${data.token}` };
  return {
    get: async (url) => (await (await request.get(url, { headers })).json()).data,
    patch: (url, body) => request.patch(url, { headers, data: body }),
  };
};

export const uniqueText = (prefix) => `${prefix} ${Date.now().toString(36)}`;
