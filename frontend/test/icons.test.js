import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { inflateSync } from 'node:zlib';
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

// The pixels of an 8-bit RGBA, non-interlaced PNG (as sharp writes it): the image data is
// inflated and each row's filter undone.
const decodePng = (buffer) => {
  const { width, height } = pngInfo(buffer);
  assert.deepEqual([buffer[24], buffer[25], buffer[28]], [8, RGBA_COLOUR_TYPE, 0], 'an 8-bit RGBA PNG');
  const chunks = [];
  for (let offset = 8; offset < buffer.length; offset += buffer.readUInt32BE(offset) + 12) {
    const length = buffer.readUInt32BE(offset);
    if (buffer.toString('latin1', offset + 4, offset + 8) === 'IDAT') chunks.push(buffer.subarray(offset + 8, offset + 8 + length));
  }
  const raw = inflateSync(Buffer.concat(chunks));
  const stride = width * 4;
  const data = Buffer.alloc(stride * height);
  for (let y = 0; y < height; y += 1) {
    const filter = raw[y * (stride + 1)];
    for (let x = 0; x < stride; x += 1) {
      const left = x >= 4 ? data[y * stride + x - 4] : 0;
      const up = y > 0 ? data[(y - 1) * stride + x] : 0;
      const upLeft = x >= 4 && y > 0 ? data[(y - 1) * stride + x - 4] : 0;
      const [toLeft, toUp, toUpLeft] = [left, up, upLeft].map((value) => Math.abs(left + up - upLeft - value));
      const paeth = toLeft <= toUp && toLeft <= toUpLeft ? left : toUp <= toUpLeft ? up : upLeft;
      const predicted = [0, left, up, (left + up) >> 1, paeth][filter];
      data[y * stride + x] = (raw[y * (stride + 1) + 1 + x] + predicted) & 0xff;
    }
  }
  const pixels = Array.from({ length: width * height }, (_, index) => [...data.subarray(index * 4, index * 4 + 4)]);
  return { width, height, pixels, at: (x, y) => pixels[y * width + x] };
};

const luminance = ([red, green, blue]) => (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255;

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

const SCHEMES = ['light', 'dark'];
const TAB_ICON_SIZES = [32, 48, 192];
const tabIcon = (scheme, size) => `favicon-${scheme}-${size}.png`;

const SQUARE_ICONS = {
  ...Object.fromEntries(SCHEMES.flatMap((scheme) => TAB_ICON_SIZES.map((size) => [tabIcon(scheme, size), size]))),
  'favicon-32.png': 32,
  'favicon-48.png': 48,
  'favicon-192.png': 192,
  'favicon-512.png': 512,
  'apple-touch-icon.png': 180,
};

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

  test('tab icons have a transparent background, and the dark-tab ones no dark pixels', async () => {
    for (const size of TAB_ICON_SIZES) {
      const [light, dark] = await Promise.all(
        SCHEMES.map(async (scheme) => decodePng(await readFile(fromPublic(tabIcon(scheme, size))))),
      );
      for (const icon of [light, dark]) assert.equal(icon.at(size / 2, 0)[3], 0, 'transparent above the logo');
      const visible = (icon) => icon.pixels.filter(([, , , alpha]) => alpha > 20);
      assert.ok(visible(light).some((pixel) => luminance(pixel) < 0.3), 'the light-tab icon keeps the dark teal');
      assert.ok(
        visible(dark).every((pixel) => luminance(pixel) > 0.5),
        'the dark-tab icon is light all over, its soft edges included',
      );
    }
    const tiled = decodePng(await readFile(fromPublic('favicon-192.png')));
    assert.equal(tiled.at(96, 2)[3], 255, 'the manifest icon keeps its opaque tile');
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

  test('the page links the tab icons by colour scheme, the manifest, and the share image', async () => {
    const html = await readFile(path.join(FRONTEND, 'index.html'), 'utf8');
    const links = [...html.matchAll(/<link ([^>]*)\/>/g)].map(([, attributes]) =>
      Object.fromEntries([...attributes.matchAll(/([\w-]+)="([^"]*)"/g)].map(([, name, value]) => [name, value])),
    );
    assert.deepEqual(links.map(({ href }) => href).toSorted(), [
      '/apple-touch-icon.png',
      '/favicon-dark-32.png',
      '/favicon-dark-48.png',
      '/favicon-light-32.png',
      '/favicon-light-48.png',
      '/site.webmanifest',
    ]);
    for (const { href } of links) await access(fromPublic(href.slice(1)));
    assert.deepEqual(
      links.filter(({ rel }) => rel === 'icon').map(({ href, sizes, media }) => [href, sizes, media]),
      [32, 48].flatMap((size) =>
        SCHEMES.map((scheme) => [`/${tabIcon(scheme, size)}`, `${size}x${size}`, `(prefers-color-scheme: ${scheme})`]),
      ),
    );
    assert.match(html, /<meta property="og:image" content="%SITE_URL%\/og-image\.png" \/>/);
    assert.match(html, /<meta name="twitter:image" content="%SITE_URL%\/og-image\.png" \/>/);
    assert.doesNotMatch(html, /favicon\.(svg|ico)/);
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
