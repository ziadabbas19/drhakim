import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { login, presetPreferences } from '../support.js';

const PUBLIC_PAGES = ['/', '/about', '/services', '/clinics', '/book', '/contact', '/login'];
const DASHBOARD_PAGES = ['/dashboard/bookings', '/dashboard/clinics', '/dashboard/about', '/dashboard/media'];

const contrastViolations = async (page) => {
  const { violations } = await new AxeBuilder({ page }).withRules(['color-contrast']).analyze();
  return violations.flatMap(({ nodes }) =>
    nodes.map((node) => `${page.url()} ${node.target.join(' ')}: ${node.failureSummary}`),
  );
};

for (const theme of ['light', 'dark']) {
  test.describe(`Text contrast, ${theme} theme`, () => {
    // Reduced motion shows every section at once, so nothing is checked mid-animation.
    test.use({ reducedMotion: 'reduce', colorScheme: theme });

    test.beforeEach(async ({ context }) => {
      await presetPreferences(context, { theme });
    });

    test('public pages, tables, dialogs, and the dashboard', async ({ page }) => {
      const problems = [];
      const check = async (pathname) => {
        await page.goto(pathname);
        await page.waitForLoadState('networkidle');
        problems.push(...(await contrastViolations(page)));
      };

      for (const pathname of PUBLIC_PAGES) await check(pathname);
      await login(page);
      for (const pathname of DASHBOARD_PAGES) await check(pathname);

      await page.goto('/dashboard/about?tab=surgery');
      await page.getByRole('button', { name: 'إضافة', exact: true }).click();
      await expect(page.getByRole('dialog')).toBeVisible();
      problems.push(...(await contrastViolations(page)));

      expect(problems).toEqual([]);
    });

    test('English pages', async ({ page, context }) => {
      await presetPreferences(context, { theme, language: 'en' });
      const problems = [];
      for (const pathname of ['/', '/about', '/clinics']) {
        await page.goto(pathname);
        await page.waitForLoadState('networkidle');
        problems.push(...(await contrastViolations(page)));
      }
      expect(problems).toEqual([]);
    });
  });
}
