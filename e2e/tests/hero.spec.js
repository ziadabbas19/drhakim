import { expect, test } from '@playwright/test';
import { adminRequest, cutoutFile, presetPreferences } from '../support.js';

const PROFILE_FIELDS = ['headlineAr', 'headlineEn', 'introAr', 'introEn', 'bioAr', 'bioEn'];

const setHeroImage = async (request, heroImageId) => {
  const admin = await adminRequest(request);
  const profile = await admin.get('/api/admin/about/profile');
  const texts = Object.fromEntries(PROFILE_FIELDS.map((field) => [field, profile[field] ?? '']));
  const saved = await admin.put('/api/admin/about/profile', { ...texts, heroImageId });
  expect(saved.ok()).toBe(true);
};

const heroVisual = (page) => page.locator('[data-hero-visual]');

// Where the photo starts its entrance: the reveal's starting offset, read with transitions off.
const entranceOffset = (page) =>
  heroVisual(page).evaluate((element) => {
    element.style.transition = 'none';
    element.removeAttribute('data-visible');
    return new DOMMatrixReadOnly(getComputedStyle(element).transform).m41;
  });

test.describe('Hero portrait', () => {
  test.beforeEach(async ({ request }) => {
    const admin = await adminRequest(request);
    const cutout = await admin.upload(await cutoutFile('cutout.png'));
    expect(cutout.hasTransparency).toBe(true);
    await setHeroImage(request, cutout.id);
  });

  test.afterEach(async ({ request }) => {
    await setHeroImage(request, null);
  });

  test('the cut-out loads first, slides in from the end side, and floats once it lands', async ({ page, context }) => {
    await page.goto('/');
    const photo = heroVisual(page).locator('[data-portrait="cutout"] img');
    await expect(photo).toHaveAttribute('fetchpriority', 'high');
    await expect(photo).toHaveAttribute('loading', 'eager');
    await expect(photo).toHaveAttribute('width', '600');
    await expect(photo).toHaveAttribute('height', '600');
    await expect(photo).toHaveAttribute('srcset', /480w/);

    await expect(heroVisual(page)).toHaveAttribute('data-visible', '');
    await expect(heroVisual(page)).toHaveCSS('opacity', '1');
    await expect(heroVisual(page).locator('.float-after-reveal')).toHaveCSS('animation-name', 'float');

    // The end side is the left in Arabic and the right in English.
    expect(await entranceOffset(page)).toBeLessThan(0);
    await presetPreferences(context, { language: 'en' });
    await page.reload();
    await expect(heroVisual(page)).toHaveAttribute('data-visible', '');
    expect(await entranceOffset(page)).toBeGreaterThan(0);
  });

  test.describe('with reduced motion', () => {
    test.use({ reducedMotion: 'reduce' });

    test('the portrait is shown at once and does not float', async ({ page }) => {
      await page.goto('/');
      await expect(heroVisual(page)).toHaveCSS('opacity', '1');
      await expect(heroVisual(page)).toHaveCSS('transform', 'none');
      await expect(heroVisual(page)).toHaveCSS('transition-duration', '0s');
      await expect(heroVisual(page).locator('.float-after-reveal')).toHaveCSS('animation-name', 'none');
    });
  });
});
