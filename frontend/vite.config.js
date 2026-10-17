import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { contentFor, siteTitleFor } from './src/config/content.js';
import { DEFAULT_LANGUAGE } from './src/config/languages.js';
import { prepaintScript } from './src/config/preferences.js';

const escapeHtml = (value) =>
  value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

const htmlVariablesPlugin = (variables) => ({
  name: 'html-variables',
  transformIndexHtml: (html) =>
    Object.entries(variables).reduce(
      (output, [name, value]) => output.replaceAll(`%${name}%`, escapeHtml(value)),
      html,
    ),
});

// Applies the saved theme and language before the first paint (see src/config/preferences.js).
const prepaintPlugin = {
  name: 'prepaint-preferences',
  transformIndexHtml: () => [{ tag: 'script', children: prepaintScript, injectTo: 'head-prepend' }],
};

// The static page is in Arabic, the default language; the app updates it for English.
const { doctor, seo } = contentFor(DEFAULT_LANGUAGE);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiTarget = env.VITE_PROXY_TARGET || 'http://localhost:5000';

  return {
    plugins: [
      react(),
      tailwindcss(),
      prepaintPlugin,
      htmlVariablesPlugin({
        SITE_URL: (env.VITE_SITE_URL || 'http://localhost:5173').replace(/\/$/, ''),
        SITE_NAME: doctor.name,
        SITE_TITLE: siteTitleFor(DEFAULT_LANGUAGE),
        SITE_DESCRIPTION: seo.description,
      }),
    ],
    server: {
      port: 5173,
      // /uploads serves images stored on disk by the API's local storage (development).
      proxy: { '/api': apiTarget, '/uploads': apiTarget },
    },
  };
});
