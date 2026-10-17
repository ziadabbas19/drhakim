import { expect, test } from '@playwright/test';
import { login, presetPreferences } from '../support.js';

const translateX = (locator) =>
  locator.evaluate((element) => new DOMMatrixReadOnly(getComputedStyle(element).transform).m41);

// The reviews section is far below the first screen on the home page.
const belowTheFold = (page) => page.locator('section#reviews [data-reveal]').first();

test.describe('Motion', () => {
  test('sections reveal when scrolled into view, animating only transform and opacity', async ({ page }) => {
    await page.goto('/');
    const header = belowTheFold(page);
    await expect(header).not.toHaveAttribute('data-visible');
    await expect(header).toHaveCSS('opacity', '0');
    await expect(header).toHaveCSS('transition-property', 'opacity, transform');

    await header.scrollIntoViewIfNeeded();
    await expect(header).toHaveAttribute('data-visible', '');
    await expect(header).toHaveCSS('opacity', '1');
  });

  test('cards enter one after another', async ({ page }) => {
    await page.goto('/services');
    const cards = page.locator('main ul > li[data-reveal]');
    await expect(cards.first()).toHaveCSS('transition-delay', /^0s/);
    await expect(cards.nth(2)).toHaveCSS('transition-delay', /0\.14s|140ms/);
  });

  test('pages fade in on route changes', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('navigation', { name: 'القائمة الرئيسية' }).getByRole('link', { name: 'الخدمات' }).click();
    await expect(page.locator('.page-enter')).toHaveCSS('animation-name', 'page-enter');
  });

  test('sideways slides follow the reading direction', async ({ page, context }) => {
    await page.goto('/about');
    const timelineItem = page.locator('ol > li[data-reveal="start"]').last();
    await expect(timelineItem).not.toHaveAttribute('data-visible');
    // "start" is the right edge in Arabic, so the item comes in from the right.
    expect(await translateX(timelineItem)).toBeGreaterThan(0);

    await presetPreferences(context, { language: 'en' });
    await page.reload();
    const englishItem = page.locator('ol > li[data-reveal="start"]').last();
    await expect(englishItem).not.toHaveAttribute('data-visible');
    expect(await translateX(englishItem)).toBeLessThan(0);
  });

  test('dialogs animate in and out', async ({ page }) => {
    await login(page);
    await page.goto('/dashboard/about?tab=membership');
    await page.getByRole('button', { name: 'إضافة', exact: true }).click();
    const dialog = page.getByRole('dialog', { name: 'إضافة: عضوية' });
    await expect(dialog).toHaveCSS('animation-name', 'dialog-in');
    await dialog.getByRole('button', { name: 'إلغاء' }).click();
    await expect(dialog).toBeHidden();
  });
});

test.describe('Reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('content is shown at once, without movement', async ({ page }) => {
    await page.goto('/');
    const header = belowTheFold(page);
    await expect(header).toHaveCSS('opacity', '1');
    await expect(header).toHaveCSS('transform', 'none');
    await expect(header).toHaveCSS('transition-duration', '0s');
    await expect(page.locator('.page-enter')).toHaveCSS('animation-name', 'none');
  });

  test('dialogs open and close without animation', async ({ page }) => {
    await login(page);
    await page.goto('/dashboard/about?tab=membership');
    await page.getByRole('button', { name: 'إضافة', exact: true }).click();
    const dialog = page.getByRole('dialog', { name: 'إضافة: عضوية' });
    await expect(dialog).toHaveCSS('animation-name', 'none');
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  });
});
