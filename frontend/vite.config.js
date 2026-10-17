import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { doctor, seo, siteTitle } from './src/config/content.js';

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

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      tailwindcss(),
      htmlVariablesPlugin({
        SITE_URL: (env.VITE_SITE_URL || 'http://localhost:5173').replace(/\/$/, ''),
        SITE_NAME: doctor.name,
        SITE_TITLE: siteTitle,
        SITE_DESCRIPTION: seo.description,
      }),
    ],
    server: {
      port: 5173,
      proxy: { '/api': env.VITE_PROXY_TARGET || 'http://localhost:5000' },
    },
  };
});
