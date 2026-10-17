import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { login, presetPreferences, uniqueText } from '../support.js';

// The steps build on each other: submit, moderate, publish, hide.
test.describe.configure({ mode: 'serial' });

const patient = uniqueText('سارة أحمد');
const LONG_COMMENT = `${'الدكتور شرح لي حالتي بهدوء ووضوح، والمتابعة بعد عملية الجيوب الأنفية كانت دقيقة جدًا. '.repeat(4)}شكرًا جزيلًا.`;

const reviewsSection = (page) => page.locator('section#reviews');
const structuredData = (page) => page.locator('script#structured-data-reviews');
const reviewRow = (page, name) => page.getByRole('row', { name: new RegExp(name) });

const openReviewsPanel = async (page) => {
  await login(page);
  await page
    .getByRole('navigation', { name: 'أقسام لوحة التحكم' })
    .getByRole('link', { name: /التقييمات/ })
    .click();
  await expect(page.getByRole('heading', { level: 1, name: 'التقييمات' })).toBeVisible();
};

test('the site starts with no reviews and a friendly invitation to add one', async ({ page }) => {
  await page.goto('/');
  const section = reviewsSection(page);
  await section.scrollIntoViewIfNeeded();
  await expect(section.getByText('لا توجد تقييمات منشورة بعد')).toBeVisible();
  await expect(section.getByRole('button', { name: 'أضف تقييمك' })).toBeVisible();
  await expect(structuredData(page)).toHaveCount(0);
});

test('a visitor submits a review; it waits for approval', async ({ page }) => {
  await page.goto('/');
  await reviewsSection(page).getByRole('button', { name: 'أضف تقييمك' }).click();
  const dialog = page.getByRole('dialog', { name: 'أضف تقييمك' });

  await dialog.getByRole('button', { name: 'إرسال التقييم' }).click();
  await expect(dialog.getByText('حقل الاسم مطلوب')).toBeVisible();
  await expect(dialog.getByText('حقل التقييم مطلوب')).toBeVisible();

  await dialog.getByLabel('الاسم').fill(patient);
  await dialog.getByLabel('المدينة').fill('طنطا');
  // The stars are a radio group: in Arabic the left arrow moves to the next star.
  await dialog.getByRole('radio', { name: 'نجمة واحدة' }).focus();
  for (let step = 0; step < 3; step += 1) await page.keyboard.press('ArrowLeft');
  await expect(dialog.getByRole('radio', { name: '4 نجوم' })).toHaveAttribute('aria-checked', 'true');
  await expect(dialog.getByRole('radio', { name: '4 نجوم' })).toBeFocused();
  await dialog.getByLabel('تعليقك').fill(LONG_COMMENT);
  await dialog.getByRole('button', { name: 'إرسال التقييم' }).click();

  await expect(page.getByText('شكرًا لك! سيظهر تقييمك في الموقع بعد مراجعته والموافقة عليه')).toBeVisible();
  await expect(dialog).toBeHidden();

  await page.reload();
  await expect(reviewsSection(page).getByText(patient)).toHaveCount(0);
  await expect(reviewsSection(page).getByText('لا توجد تقييمات منشورة بعد')).toBeVisible();
});

test('the doctor sees it pending, reads it in full, publishes and features it', async ({ page }) => {
  await login(page);
  const reviewsLink = page
    .getByRole('navigation', { name: 'أقسام لوحة التحكم' })
    .getByRole('link', { name: /التقييمات/ });
  await expect(reviewsLink).toContainText('1');
  await expect(reviewsLink.getByText('تقييم واحد بانتظار المراجعة')).toBeAttached();
  await reviewsLink.click();

  await expect(page.getByText('لا يمكن تعديل نص التقييم')).toBeVisible();
  const row = reviewRow(page, patient);
  await expect(row.getByText('بانتظار المراجعة')).toBeVisible();

  await row.getByRole('button', { name: 'عرض' }).click();
  const detail = page.getByRole('dialog', { name: `تقييم ${patient}` });
  await expect(detail.getByText('شكرًا جزيلًا.', { exact: false })).toBeVisible();
  await expect(detail.getByRole('textbox')).toHaveCount(0);
  await detail.getByRole('button', { name: 'إغلاق' }).click();

  await row.getByRole('button', { name: 'نشر', exact: true }).click();
  await expect(row.getByText('منشور')).toBeVisible();
  await expect(reviewsLink).not.toContainText('1');

  await row.getByRole('button', { name: 'تمييز', exact: true }).click();
  await expect(row.getByText('مميز', { exact: true })).toBeVisible();
});

for (const language of ['ar', 'en']) {
  for (const theme of ['light', 'dark']) {
    test(`the published review appears on the home page (${language}, ${theme})`, async ({ page, context }) => {
      await presetPreferences(context, { language, theme });
      await page.goto('/');
      const section = reviewsSection(page);
      await section.scrollIntoViewIfNeeded();

      // Shown as written, in Arabic, whatever the site language.
      await expect(section.getByText(patient)).toBeVisible();
      await expect(section.getByText('4.0', { exact: true })).toBeVisible();
      await expect(
        section.getByText(language === 'ar' ? 'من تقييم واحد' : 'from 1 review', { exact: false }),
      ).toBeVisible();
      await expect(
        section.getByRole('img', { name: language === 'ar' ? 'تقييم 4 من 5' : 'Rated 4 out of 5' }),
      ).toBeVisible();

      const readMore = section.getByRole('button', { name: language === 'ar' ? 'اقرأ المزيد' : 'Read more' });
      await readMore.click();
      const readLess = section.getByRole('button', { name: language === 'ar' ? 'عرض أقل' : 'Show less' });
      await expect(readLess).toHaveAttribute('aria-expanded', 'true');

      const data = JSON.parse(await structuredData(page).textContent());
      expect(data.aggregateRating).toMatchObject({ ratingValue: 4, reviewCount: 1, bestRating: 5 });
      expect(data.review[0]).toMatchObject({ author: { name: patient }, reviewRating: { ratingValue: 4 } });
    });
  }
}

test('hiding the review removes it from the site again', async ({ page }) => {
  await openReviewsPanel(page);
  const row = reviewRow(page, patient);
  await row.getByRole('button', { name: 'إخفاء', exact: true }).click();
  await expect(row.getByText('مخفي')).toBeVisible();

  await page.goto('/');
  await expect(reviewsSection(page).getByText('لا توجد تقييمات منشورة بعد')).toBeVisible();
  await expect(structuredData(page)).toHaveCount(0);
});

test('selected reviews are published together, and a review can be deleted', async ({ page }) => {
  const names = [uniqueText('محمد علي'), uniqueText('Mona Hassan')];
  for (const [index, name] of names.entries()) {
    const response = await page.request.post('/api/reviews', {
      data: { patientName: name, city: 'القاهرة', rating: 5 - index, comment: `تجربة رائعة ${name}` },
    });
    expect(response.status()).toBe(201);
  }

  await openReviewsPanel(page);
  for (const name of names) await page.getByRole('checkbox', { name: `تحديد تقييم ${name}` }).check();
  await expect(page.getByText('تم تحديد تقييمين')).toBeVisible();
  await page.getByRole('button', { name: 'نشر المحدد' }).click();
  await expect(page.getByText('تم تحديث تقييمين')).toBeVisible();
  for (const name of names) await expect(reviewRow(page, name).getByText('منشور')).toBeVisible();

  await reviewRow(page, names[1]).getByRole('button', { name: 'حذف' }).click();
  await page.getByRole('dialog', { name: 'حذف التقييم' }).getByRole('button', { name: 'حذف' }).click();
  await expect(reviewRow(page, names[1])).toHaveCount(0);

  await page.goto('/about#reviews');
  const section = reviewsSection(page);
  await expect(section.getByRole('heading', { name: 'كل التقييمات' })).toBeInViewport();
  await expect(section.getByText(names[0], { exact: true })).toBeVisible();
  await expect(section.getByText(names[1], { exact: true })).toHaveCount(0);
});

test('staff without the reviews permission cannot open the reviews section', async ({ page }) => {
  await login(page, 'staff');
  const nav = page.getByRole('navigation', { name: 'أقسام لوحة التحكم' });
  await expect(nav.getByRole('link', { name: /التقييمات/ })).toHaveCount(0);
  await page.goto('/dashboard/reviews');
  await expect(page).toHaveURL(/\/dashboard\/bookings$/);
});

for (const theme of ['light', 'dark']) {
  test(`reviews keep readable contrast (${theme})`, async ({ page, context }) => {
    await presetPreferences(context, { theme });
    await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: theme });
    const problems = [];
    const check = async () => {
      const { violations } = await new AxeBuilder({ page }).withRules(['color-contrast']).analyze();
      problems.push(
        ...violations.flatMap(({ nodes }) => nodes.map((node) => `${page.url()} ${node.target.join(' ')}`)),
      );
    };

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await check();
    await openReviewsPanel(page);
    await check();
    expect(problems).toEqual([]);
  });
}
