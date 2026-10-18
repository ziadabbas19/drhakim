import { expect, test } from '@playwright/test';
import { ABOUT_SECTIONS, aboutContentOf } from '../../frontend/src/features/about/aboutContent.js';
import { translate } from '../../frontend/src/i18n/translate.js';

// Runs before every other browser test (see playwright.config.js), so the site is exactly as a
// fresh database plus `npm run seed` leaves it: sample About content, no images, no reviews.
const text = (key) => translate('ar', key);

const watchErrors = (page) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  return errors;
};

const sectionTitled = (page, title) =>
  page.locator('section', { has: page.getByRole('heading', { level: 2, name: title, exact: true }) });

test('the About page opens on a freshly seeded database', async ({ page, request }) => {
  const errors = watchErrors(page);
  const content = aboutContentOf((await (await request.get('/api/about')).json()).data);

  await page.goto('/about');
  await expect(page.getByRole('heading', { level: 2, name: content.profile.headline })).toBeVisible();
  for (const section of ABOUT_SECTIONS) {
    const region = sectionTitled(page, text(section.title));
    const [first] = section.list(content);
    if (first?.title) await expect(region.getByText(first.title, { exact: true }).first()).toBeVisible();
    else if (first) await expect(region.getByRole('img').first()).toBeVisible();
    else await expect(region.getByText(text(`about.empty.${section.key}`))).toBeVisible();
  }
  await expect(sectionTitled(page, text('reviews.allTitle')).getByText(text('reviews.empty'))).toBeVisible();
  await expect(page.getByText(text('errors.crash.page'))).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('the home page opens on a freshly seeded database', async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(sectionTitled(page, text('reviews.title')).getByText(text('reviews.empty'))).toBeVisible();
  expect(errors).toEqual([]);
});

// The production crash: a reviews reply that is not the API's JSON blanked the whole About page.
test('a broken reviews reply only affects the reviews section', async ({ page }) => {
  const errors = watchErrors(page);
  await page.route('**/api/reviews?*', (route) =>
    route.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>Site</title>' }),
  );

  await page.goto('/about');
  const reviews = sectionTitled(page, text('reviews.allTitle'));
  await expect(reviews.getByText(text('errors.unexpectedResponse'))).toBeVisible();
  await expect(reviews.getByRole('button', { name: text('common.retry') })).toBeVisible();
  await expect(sectionTitled(page, text('about.qualifications'))).toBeVisible();
  expect(errors).toEqual([]);
});
