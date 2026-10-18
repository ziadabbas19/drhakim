import { expect, test } from '@playwright/test';
import { DOCTOR_PHONE } from '../../backend/src/seeders/content.js';
import { STORAGE_KEYS, adminRequest, presetPreferences } from '../support.js';

const html = (page) => page.locator('html');

test.describe('Language', () => {
  test('Arabic is the default, right to left', async ({ page }) => {
    await page.goto('/');
    await expect(html(page)).toHaveAttribute('lang', 'ar');
    await expect(html(page)).toHaveAttribute('dir', 'rtl');
    await expect(page).toHaveTitle(/د\. عبد الحكيم عبد السلام/);
    await expect(page.getByRole('heading', { level: 1, name: 'د. عبد الحكيم عبد السلام' })).toBeVisible();
  });

  test('switching to English updates direction, text, content from the API, title, and meta tags', async ({ page }) => {
    await page.goto('/clinics');
    await page.getByRole('button', { name: /English/ }).click();

    await expect(html(page)).toHaveAttribute('lang', 'en');
    await expect(html(page)).toHaveAttribute('dir', 'ltr');
    await expect(page.getByRole('heading', { level: 1, name: 'Clinics and opening hours' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'El-Santa Clinic' })).toBeVisible();
    await expect(page).toHaveTitle('Clinics and hours | Dr. Abdelhakim Abdelsalam');
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /ENT specialist and surgeon/);
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute('content', 'en_US');

    await page.reload();
    await expect(html(page)).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('heading', { name: 'El-Santa Clinic' })).toBeVisible();

    await page.getByRole('button', { name: /العربية/ }).click();
    await expect(html(page)).toHaveAttribute('dir', 'rtl');
    await expect(page.getByRole('heading', { name: 'عيادة السنطة' })).toBeVisible();
  });

  test('phone numbers stay left to right inside Arabic text', async ({ page }) => {
    await page.goto('/clinics');
    const phone = page.getByRole('link', { name: DOCTOR_PHONE }).first();
    await expect(phone).toHaveAttribute('dir', 'ltr');
    await expect(phone).toHaveCSS('direction', 'ltr');
  });

  test('dates and times follow the language', async ({ page, request }) => {
    // Clinics start without hours, so the test publishes some for one clinic.
    const admin = await adminRequest(request);
    const { items } = await admin.get('/api/admin/clinics');
    const schedule = `/api/admin/clinics/${items[0].id}/schedule`;
    await admin.put(schedule, { ranges: [{ dayOfWeek: 6, startTime: '16:00', endTime: '21:00' }] });
    try {
      await page.goto('/clinics');
      await expect(page.getByText('السبت').first()).toBeVisible();
      await page.getByRole('button', { name: /English/ }).click();
      await expect(page.getByText('Saturday').first()).toBeVisible();
      await expect(page.getByText(/4:00\s?PM/).first()).toBeVisible();
    } finally {
      await admin.put(schedule, { ranges: [] });
    }
  });
});

test.describe('Theme', () => {
  test('follows the system preference by default', async ({ browser }) => {
    for (const colorScheme of ['dark', 'light']) {
      const context = await browser.newContext({ colorScheme });
      const page = await context.newPage();
      await page.goto('/');
      await expect(html(page)).toHaveAttribute('data-theme', colorScheme);
      await context.close();
    }
  });

  test('the chosen theme persists and colors come from the tokens', async ({ page }) => {
    await page.goto('/');
    const lightBackground = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);

    await page.getByRole('radio', { name: 'داكن' }).click();
    await expect(html(page)).toHaveAttribute('data-theme', 'dark');
    await expect(page.locator('body')).not.toHaveCSS('background-color', lightBackground);
    expect(await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEYS.theme)).toBe('dark');

    await page.reload();
    await expect(html(page)).toHaveAttribute('data-theme', 'dark');
    await expect(page.getByRole('radio', { name: 'داكن' })).toHaveAttribute('aria-checked', 'true');

    await page.getByRole('radio', { name: 'فاتح' }).click();
    await expect(html(page)).toHaveAttribute('data-theme', 'light');
  });

  test('saved theme and language apply before the app loads, so there is no flash', async ({ page, context }) => {
    await presetPreferences(context, { theme: 'dark', language: 'en' });
    // With the app bundle blocked, only the inline script in index.html can set these.
    await page.route(/\/assets\/.*\.js$/, (route) => route.abort());
    await page.goto('/');
    await expect(html(page)).toHaveAttribute('data-theme', 'dark');
    await expect(html(page)).toHaveAttribute('lang', 'en');
    await expect(html(page)).toHaveAttribute('dir', 'ltr');
    await expect(html(page)).toHaveCSS('color-scheme', 'dark');
  });

  test('the theme switch works with the keyboard and follows the reading direction', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('radio', { name: 'حسب الجهاز' }).focus();
    // Options run right to left in Arabic, so the right arrow moves back towards the first one.
    await page.keyboard.press('ArrowRight');
    await expect(page.getByRole('radio', { name: 'داكن' })).toBeFocused();
    await expect(html(page)).toHaveAttribute('data-theme', 'dark');
  });
});
