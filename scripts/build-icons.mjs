// npm run build:icons: makes the brand images from images-source/logo.png, once, for committing:
// - frontend/src/assets/logo.png: the logo on a transparent background, 1024 px wide (master);
// - frontend/src/assets/logo-mark.webp: the size shown next to the doctor's name in the site;
// - frontend/public/favicon.ico, favicon-32.png, favicon-192.png, favicon-512.png, and
//   apple-touch-icon.png, each on a light tile so the dark teal letters show on dark tabs;
// - frontend/public/site.webmanifest, and frontend/public/og-image.png (the social share image).
// Colours come from frontend/src/styles/tokens.css and names from frontend/src/config/content.js.
// images-source/ itself is never committed.
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from '@playwright/test';
import { contentFor, siteTitleFor } from '../frontend/src/config/content.js';
import { DEFAULT_LANGUAGE } from '../frontend/src/config/languages.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sharp = createRequire(path.join(ROOT, 'backend', 'package.json'))('sharp');

const SOURCE = path.join(ROOT, 'images-source', 'logo.png');
const ASSETS = path.join(ROOT, 'frontend', 'src', 'assets');
const PUBLIC = path.join(ROOT, 'frontend', 'public');
const FONT_CSS = path.join(ROOT, 'frontend', 'node_modules', '@fontsource-variable', 'cairo', 'wght.css');

// Pixels this close to white (in their darkest channel) become transparent, over a short ramp,
// so the script also works with the logo on a white background.
const WHITE_RAMP = Object.freeze({ low: 8, high: 48 });
const MASTER_WIDTH = 1024;
const MASTER_PADDING = 0.03;
// Shown 40 px tall next to the doctor's name; stored at twice that for sharp screens.
const LOGO_MARK = Object.freeze({ width: 176, height: 96 });
// The full logo from 48 px up. Below that its fine strokes blur together, so the tab icons use
// a simplified mark: the letters HA in a heavy weight of the site's font, in the logo's teal.
const SIMPLE_MARK_BELOW = 48;
const ICO_SIZES = [16, 32, 48];
const TILE_RADIUS = 0.22;
const TILE_PADDING = { full: 0.1, simple: 0.14, appleTouch: 0.14 };
// The share image shows the logo, the doctor's name, and this title only.
const SHARE_TITLE = 'أخصائي أنف وأذن وحنجرة';
const SHARE_SIZE = Object.freeze({ width: 1200, height: 630 });

// Colours of the light theme (the token block before the dark theme's), by token name.
const readColours = async () => {
  const css = await readFile(path.join(ROOT, 'frontend', 'src', 'styles', 'tokens.css'), 'utf8');
  const light = css.slice(0, css.indexOf('@layer base'));
  const colours = Object.fromEntries(
    [...light.matchAll(/--color-([\w-]+):\s*(#[0-9a-f]{6})/gi)].map(([, name, value]) => [name, value]),
  );
  return (name) => {
    if (!colours[name]) throw new Error(`No --color-${name} token in tokens.css`);
    return colours[name];
  };
};

const ramp = (value, { low, high }) => Math.max(0, Math.min(1, (value - low) / (high - low)));

// Removes any white background and un-mixes the white from the soft edge, so no light fringe
// is left around the strokes, then crops to the logo with a little padding.
const cleanLogo = async () => {
  const { data, info } = await sharp(SOURCE).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let index = 0; index < data.length; index += 4) {
    const coverage = ramp(255 - Math.min(data[index], data[index + 1], data[index + 2]), WHITE_RAMP);
    data[index + 3] = Math.round(data[index + 3] * coverage);
    if (coverage > 0 && coverage < 1) {
      for (let channel = 0; channel < 3; channel += 1) {
        const value = (data[index + channel] - (1 - coverage) * 255) / coverage;
        data[index + channel] = Math.max(0, Math.min(255, Math.round(value)));
      }
    }
  }
  const trimmed = await sharp(data, { raw: info }).trim({ threshold: 1 }).png().toBuffer();
  const { width, height } = await sharp(trimmed).metadata();
  const padding = Math.round(Math.max(width, height) * MASTER_PADDING);
  // Separate steps: sharp would otherwise resize before extending.
  const padded = await sharp(trimmed)
    .extend({ top: padding, bottom: padding, left: padding, right: padding, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  return sharp(padded).resize({ width: MASTER_WIDTH, kernel: 'lanczos3' }).png({ compressionLevel: 9 }).toBuffer();
};

// The logo's own teal: the middle value of its cool, fully opaque pixels.
const logoTeal = async (logo) => {
  const { data } = await sharp(logo).raw().toBuffer({ resolveWithObject: true });
  const channels = [[], [], []];
  for (let index = 0; index < data.length; index += 4) {
    if (data[index + 3] < 250 || data[index] > data[index + 2]) continue;
    for (let channel = 0; channel < 3; channel += 1) channels[channel].push(data[index + channel]);
  }
  const median = (values) => values.sort((a, b) => a - b)[Math.floor(values.length / 2)];
  return `#${channels.map((values) => median(values).toString(16).padStart(2, '0')).join('')}`;
};

const tileSvg = (size, colour, radius) =>
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">` +
      `<rect width="${size}" height="${size}" rx="${radius}" fill="${colour}"/></svg>`,
  );

const onTile = async (mark, size, { colour, padding, rounded = true }) => {
  const inner = Math.round(size * (1 - 2 * padding));
  const fitted = await sharp(mark).resize({ width: inner, height: inner, fit: 'inside', kernel: 'lanczos3' }).toBuffer();
  return sharp(tileSvg(size, colour, rounded ? Math.round(size * TILE_RADIUS) : 0))
    .composite([{ input: fitted, gravity: 'center' }])
    .png({ compressionLevel: 9 })
    .toBuffer();
};

// ICO files may hold PNG images directly; every current browser and Windows reads them.
const toIco = (images) => {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = header.length + 16 * images.length;
  const entries = images.map(({ size, png }) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size, 0);
    entry.writeUInt8(size, 1);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(png.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += png.length;
    return entry;
  });
  return Buffer.concat([header, ...entries, ...images.map(({ png }) => png)]);
};

// Renders HTML in the site's font (Cairo, from the installed font package) to a PNG.
const createRenderer = async () => {
  const browser = await chromium.launch();
  const folder = await mkdtemp(path.join(os.tmpdir(), 'dr-hakim-brand-'));
  let count = 0;
  const render = async (body, { width, height, transparent = false }) => {
    count += 1;
    const file = path.join(folder, `page-${count}.html`);
    await writeFile(
      file,
      `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8">` +
        `<link rel="stylesheet" href="${pathToFileURL(FONT_CSS).href}">` +
        `<style>html,body{margin:0;width:${width}px;height:${height}px;background:transparent;` +
        `font-family:'Cairo Variable',sans-serif}</style></head><body>${body}</body></html>`,
    );
    const page = await browser.newPage({ viewport: { width, height } });
    await page.goto(pathToFileURL(file).href);
    await page.evaluate(() => document.fonts.ready);
    const png = await page.screenshot({ omitBackground: transparent });
    await page.close();
    return png;
  };
  const close = async () => {
    await browser.close();
    await rm(folder, { recursive: true, force: true });
  };
  return { render, close };
};

const simpleMark = (render, teal) =>
  render(
    `<div style="display:grid;place-items:center;width:512px;height:512px;font-weight:900;font-size:300px;` +
      `line-height:1;letter-spacing:-0.02em;color:${teal}" dir="ltr">HA</div>`,
    { width: 512, height: 512, transparent: true },
  ).then((png) => sharp(png).trim({ threshold: 1 }).png().toBuffer());

const shareImage = (render, logo, colour, name) =>
  render(
    `<div style="position:relative;display:flex;align-items:center;gap:72px;box-sizing:border-box;` +
      `width:${SHARE_SIZE.width}px;height:${SHARE_SIZE.height}px;padding:0 96px;overflow:hidden;` +
      `background:linear-gradient(135deg,${colour('hero-from')},${colour('hero-via')} 55%,${colour('hero-to')})">` +
      `<div style="position:absolute;inset-inline-end:-160px;top:-160px;width:620px;height:620px;border-radius:50%;` +
      `border:1px solid rgb(255 255 255 / 0.12)"></div>` +
      `<div style="flex:1;color:${colour('on-inverse')}">` +
      `<div style="font-weight:800;font-size:76px;line-height:1.25">${name}</div>` +
      `<div style="width:120px;height:4px;margin:28px 0;border-radius:2px;background:${colour('accent')}"></div>` +
      `<div style="font-weight:600;font-size:44px;color:${colour('on-inverse-muted')}">${SHARE_TITLE}</div></div>` +
      `<div style="display:grid;place-items:center;width:380px;height:300px;border-radius:40px;` +
      `background:${colour('surface-tint')};box-shadow:0 20px 60px -20px rgb(0 0 0 / 0.5)">` +
      `<img src="data:image/png;base64,${logo.toString('base64')}" style="width:300px"></div></div>`,
    SHARE_SIZE,
  ).then((png) => sharp(png).png({ compressionLevel: 9 }).toBuffer());

const manifest = () => {
  const { doctor } = contentFor(DEFAULT_LANGUAGE);
  return {
    name: siteTitleFor(DEFAULT_LANGUAGE),
    short_name: doctor.knownAs,
    lang: DEFAULT_LANGUAGE,
    dir: 'rtl',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ffffff',
    icons: [192, 512].map((size) => ({ src: `/favicon-${size}.png`, sizes: `${size}x${size}`, type: 'image/png' })),
  };
};

const colour = await readColours();
const logo = await cleanLogo();
const renderer = await createRenderer();
try {
  const simple = await simpleMark(renderer.render, await logoTeal(logo));
  const tile = { colour: colour('surface-tint') };
  const icon = (size) =>
    size < SIMPLE_MARK_BELOW
      ? onTile(simple, size, { ...tile, padding: TILE_PADDING.simple })
      : onTile(logo, size, { ...tile, padding: TILE_PADDING.full });

  await mkdir(ASSETS, { recursive: true });
  const outputs = {
    [path.join(ASSETS, 'logo.png')]: logo,
    [path.join(ASSETS, 'logo-mark.webp')]: await sharp(logo)
      .resize({ ...LOGO_MARK, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .webp({ quality: 90, alphaQuality: 100 })
      .toBuffer(),
    [path.join(PUBLIC, 'favicon.ico')]: toIco(
      await Promise.all(ICO_SIZES.map(async (size) => ({ size, png: await icon(size) }))),
    ),
    [path.join(PUBLIC, 'favicon-32.png')]: await icon(32),
    [path.join(PUBLIC, 'favicon-192.png')]: await icon(192),
    [path.join(PUBLIC, 'favicon-512.png')]: await icon(512),
    // iOS rounds the corners itself, so this one fills the whole square.
    [path.join(PUBLIC, 'apple-touch-icon.png')]: await onTile(logo, 180, {
      ...tile,
      padding: TILE_PADDING.appleTouch,
      rounded: false,
    }),
    [path.join(PUBLIC, 'site.webmanifest')]: `${JSON.stringify(manifest(), null, 2)}\n`,
    [path.join(PUBLIC, 'og-image.png')]: await shareImage(
      renderer.render,
      logo,
      colour,
      contentFor(DEFAULT_LANGUAGE).doctor.name,
    ),
  };
  for (const [file, data] of Object.entries(outputs)) {
    await writeFile(file, data);
    console.log(`wrote ${path.relative(ROOT, file)}`);
  }
} finally {
  await renderer.close();
}
