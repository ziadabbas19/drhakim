import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from '@playwright/test';
import { adminRequest, login, presetPreferences } from '../support.js';

// Full-page screenshots for review: npm run screenshots (written to e2e/screenshots). The site
// starts with no reviews, so the first round shows the empty state; two reviews are then
// published and the pages that show reviews are captured again.
test.describe.configure({ mode: 'serial' });

const OUTPUT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../screenshots');

const VIEWPORTS = {
  mobile: { width: 390, height: 844 },
  desktop: { width: 1440, height: 900 },
};

const COMBINATIONS = Object.entries(VIEWPORTS).flatMap(([viewportName, viewport]) =>
  ['light', 'dark'].flatMap((theme) => ['ar', 'en'].map((language) => ({ viewportName, viewport, theme, language }))),
);

const PUBLIC_PAGES = { home: '/', about: '/about', clinics: '/clinics', booking: '/book' };
const DASHBOARD_PAGES = {
  'dashboard-bookings': '/dashboard/bookings',
  'dashboard-reviews': '/dashboard/reviews',
  'dashboard-about': '/dashboard/about',
  'dashboard-media': '/dashboard/media',
};
const REVIEW_PAGES = { 'home-with-reviews': '/', 'about-with-reviews': '/about#reviews' };

const SAMPLE_REVIEWS = [
  {
    patientName: 'أم يوسف',
    city: 'السنطة',
    rating: 5,
    comment: 'الدكتور شرح لنا كل حاجة بهدوء وطمّنا، ونوم ابني اتحسن جدًا بعد العملية.',
  },
  {
    patientName: 'Mona Hassan',
    city: 'Cairo',
    rating: 4,
    comment: 'Clear explanation and careful follow-up after my sinus surgery.',
  },
];

// Opens a context with the given preferences and hands the steps a page and capture helpers.
const withPreferences = async (browser, { viewportName, viewport, theme, language }, steps) => {
  // Reduced motion shows every section immediately, as a full-page capture needs.
  const context = await browser.newContext({ viewport, reducedMotion: 'reduce', colorScheme: theme });
  await presetPreferences(context, { theme, language });
  const page = await context.newPage();
  const screenshot = (name, options) =>
    page.screenshot({ path: path.join(OUTPUT_DIR, `${name}-${viewportName}-${theme}-${language}.png`), ...options });
  const captureAll = async (pages) => {
    for (const [name, pathname] of Object.entries(pages)) {
      await page.goto(pathname);
      await page.waitForLoadState('networkidle');
      await screenshot(name, { fullPage: true });
    }
  };
  await steps({ page, screenshot, captureAll });
  await context.close();
};

for (const combination of COMBINATIONS) {
  const { viewportName, theme, language } = combination;
  test(`${viewportName} ${theme} ${language}`, async ({ browser }) => {
    await withPreferences(browser, combination, async ({ page, screenshot, captureAll }) => {
      await captureAll(PUBLIC_PAGES);

      // The review form, opened from the empty reviews section.
      await page.goto('/');
      await page
        .locator('section#reviews')
        .getByRole('button', { name: /أضف تقييمك|Add your review/ })
        .click();
      await page.getByRole('dialog').getByRole('radio').nth(3).click();
      await screenshot('review-form');

      await login(page);
      await captureAll(DASHBOARD_PAGES);
    });
  });
}

test('publish sample reviews', async ({ request }) => {
  // A separate address, so these submissions do not count against the per-day limit.
  const headers = { 'X-Forwarded-For': '203.0.113.20' };
  for (const review of SAMPLE_REVIEWS) await request.post('/api/reviews', { headers, data: review });
  const admin = await adminRequest(request);
  const { items } = await admin.get('/api/admin/reviews?status=pending');
  for (const review of items) await admin.patch(`/api/admin/reviews/${review.id}`, { status: 'approved' });
  await admin.patch(`/api/admin/reviews/${items.at(-1).id}`, { isFeatured: true });
});

for (const combination of COMBINATIONS) {
  const { viewportName, theme, language } = combination;
  test(`${viewportName} ${theme} ${language} with reviews`, async ({ browser }) => {
    await withPreferences(browser, combination, async ({ page, captureAll }) => {
      await captureAll(REVIEW_PAGES);
      await login(page);
      await captureAll({ 'dashboard-reviews-with-reviews': '/dashboard/reviews' });
    });
  });
}
