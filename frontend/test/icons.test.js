import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, test } from 'vitest';
import { contentFor, siteTitleFor } from '../src/config/content.js';
import { DEFAULT_LANGUAGE } from '../src/config/languages.js';

// The files made by `npm run build:icons` (scripts/build-icons.mjs).
const FRONTEND = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fromPublic = (name) => path.join(FRONTEND, 'public', name);

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const RGBA_COLOUR_TYPE = 6;

const pngInfo = (buffer) => {
  assert.ok(buffer.subarray(0, 8).equals(PNG_SIGNATURE), 'a PNG file');
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20), hasAlpha: buffer[25] === RGBA_COLOUR_TYPE };
};

const readPng = async (file) => pngInfo(await readFile(file));

// An ICO holding PNG images: its directory lists each size and where its image is.
const icoImages = (buffer) =>
  Array.from({ length: buffer.readUInt16LE(4) }, (_, index) => {
    const entry = 6 + index * 16;
    const [length, offset] = [buffer.readUInt32LE(entry + 8), buffer.readUInt32LE(entry + 12)];
    return { size: buffer[entry] || 256, image: pngInfo(buffer.subarray(offset, offset + length)) };
  });

// A WebP with transparency starts with a VP8X chunk holding the canvas size, less one.
const webpSize = (buffer) => {
  assert.equal(buffer.toString('latin1', 12, 16), 'VP8X');
  return { width: buffer.readUIntLE(24, 3) + 1, height: buffer.readUIntLE(27, 3) + 1 };
};

const SQUARE_ICONS = { 'favicon-32.png': 32, 'favicon-192.png': 192, 'favicon-512.png': 512, 'apple-touch-icon.png': 180 };

describe('Brand images', () => {
  test('every icon exists at its size', async () => {
    for (const [name, size] of Object.entries(SQUARE_ICONS)) {
      const { width, height } = await readPng(fromPublic(name));
      assert.deepEqual([width, height], [size, size], name);
    }
    const ico = icoImages(await readFile(fromPublic('favicon.ico')));
    assert.deepEqual(
      ico.map(({ size }) => size),
      [16, 32, 48],
    );
    for (const { size, image } of ico) assert.deepEqual([image.width, image.height], [size, size]);
  });

  test('the logo master and the share image have their sizes', async () => {
    const master = await readPng(path.join(FRONTEND, 'src', 'assets', 'logo.png'));
    assert.equal(master.width, 1024);
    assert.equal(master.hasAlpha, true);
    assert.deepEqual(webpSize(await readFile(path.join(FRONTEND, 'src', 'assets', 'logo-mark.webp'))), {
      width: 176,
      height: 96,
    });
    const share = await readPng(fromPublic('og-image.png'));
    assert.deepEqual([share.width, share.height], [1200, 630]);
  });

  test('the page links the icons, the manifest, and the share image', async () => {
    const html = await readFile(path.join(FRONTEND, 'index.html'), 'utf8');
    const linked = [...html.matchAll(/<link [^>]*href="\/([^"]+)"/g)].map(([, href]) => href);
    assert.deepEqual(linked.toSorted(), [
      'apple-touch-icon.png',
      'favicon-192.png',
      'favicon-32.png',
      'favicon.ico',
      'site.webmanifest',
    ]);
    for (const name of linked) await access(fromPublic(name));
    assert.match(html, /<meta property="og:image" content="%SITE_URL%\/og-image\.png" \/>/);
    assert.match(html, /<meta name="twitter:image" content="%SITE_URL%\/og-image\.png" \/>/);
    assert.doesNotMatch(html, /favicon\.svg/);
  });

  test('the manifest is valid and uses the site name', async () => {
    const manifest = JSON.parse(await readFile(fromPublic('site.webmanifest'), 'utf8'));
    assert.equal(manifest.name, siteTitleFor(DEFAULT_LANGUAGE));
    assert.equal(manifest.short_name, contentFor(DEFAULT_LANGUAGE).doctor.knownAs);
    assert.deepEqual(
      manifest.icons.map(({ src, sizes }) => [src, sizes]),
      [
        ['/favicon-192.png', '192x192'],
        ['/favicon-512.png', '512x512'],
      ],
    );
    for (const { src, sizes } of manifest.icons) {
      const { width, height } = await readPng(fromPublic(src.slice(1)));
      assert.equal(`${width}x${height}`, sizes);
    }
  });
});
