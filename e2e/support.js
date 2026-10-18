import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { TEST_USERS } from '../backend/test/support/users.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sharp = createRequire(path.join(ROOT, 'backend', 'package.json'))('sharp');

export const STORAGE_KEYS = Object.freeze({ language: 'dr-hakim:language', theme: 'dr-hakim:theme' });

// A figure on a transparent background, like a cut-out portrait.
export const cutoutFile = async (name, size = 600) => ({
  name,
  mimeType: 'image/png',
  buffer: await sharp(
    Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">` +
        `<circle cx="${size / 2}" cy="${size * 0.3}" r="${size * 0.16}" fill="#1c6878"/>` +
        `<rect x="${size * 0.2}" y="${size * 0.5}" width="${size * 0.6}" height="${size * 0.5}" rx="${size * 0.1}" fill="#1c6878"/></svg>`,
    ),
  )
    .png()
    .toBuffer(),
});

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
    post: (url, body) => request.post(url, { headers, data: body }),
    put: (url, body) => request.put(url, { headers, data: body }),
    patch: (url, body) => request.patch(url, { headers, data: body }),
    upload: async (file) =>
      (await (await request.post('/api/admin/media', { headers, multipart: { files: file } })).json()).data[0],
  };
};

export const uniqueText = (prefix) => `${prefix} ${Date.now().toString(36)}`;
