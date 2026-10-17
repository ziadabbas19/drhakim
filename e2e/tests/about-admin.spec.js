import { expect, test } from '@playwright/test';
import { login, pngFile, uniqueText } from '../support.js';

const listRow = (page, text) => page.locator('ol').getByRole('listitem').filter({ hasText: text });

const saveDialog = async (dialog) => {
  await dialog.getByRole('button', { name: 'حفظ', exact: true }).click();
  await expect(dialog).toBeHidden();
};

test.describe('About page managed from the dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('the headline and biography are edited in both languages and shown on the About page', async ({ page }) => {
    const headline = uniqueText('عنوان تجريبي');
    const englishHeadline = uniqueText('Test headline');
    const biography = uniqueText('نبذة محدثة من لوحة التحكم');

    await page.goto('/dashboard/about');
    await page.getByLabel('العنوان الرئيسي (عربي)').fill(headline);
    await page.getByLabel('العنوان الرئيسي (إنجليزي)').fill(englishHeadline);
    const arabicBio = page.getByRole('textbox', { name: 'النبذة (عربي)' });
    await arabicBio.click();
    await page.keyboard.press('Control+A');
    await page.keyboard.type(biography);
    await page.getByRole('button', { name: 'حفظ صفحة التعريف' }).click();
    await expect(page.getByText('تم الحفظ بنجاح')).toBeVisible();

    await page.goto('/about');
    await expect(page.getByRole('heading', { name: headline })).toBeVisible();
    await expect(page.getByText(biography)).toBeVisible();

    await page.getByRole('button', { name: /English/ }).click();
    await expect(page.getByRole('heading', { name: englishHeadline })).toBeVisible();
  });

  test('list items are reordered with one save', async ({ page }) => {
    await page.goto('/dashboard/about?tab=membership');
    const rows = page.locator('ol').getByRole('listitem');
    const second = await rows.nth(1).locator('p').first().innerText();
    await rows.nth(1).getByRole('button', { name: 'تحريك لأعلى' }).click();
    await expect(rows.first().locator('p').first()).toHaveText(second);

    await page.goto('/about');
    await expect(page.locator('section', { hasText: 'العضويات المهنية' }).getByRole('listitem').first()).toHaveText(
      second,
    );
  });

  test('surgery photos are uploaded on the spot and open in a keyboard-friendly lightbox', async ({ page }) => {
    const surgery = uniqueText('جراحة اختبار');

    await page.goto('/dashboard/about?tab=surgery');
    await expect(page.getByText('صور المرضى تحتاج إلى موافقة مكتوبة')).toBeVisible();
    await page.getByRole('button', { name: 'إضافة', exact: true }).click();
    const dialog = page.getByRole('dialog', { name: 'إضافة: عملية' });
    await expect(dialog.getByText('صور المرضى تحتاج إلى موافقة مكتوبة')).toBeVisible();
    await dialog.getByLabel('اسم العملية (عربي)').fill(surgery);
    await dialog.getByLabel('التخصص').selectOption('nose');

    await dialog.getByRole('button', { name: 'إضافة صور' }).click();
    const picker = page.getByRole('dialog', { name: 'اختر صورًا من المكتبة' });
    await picker
      .getByTestId('media-file-input')
      .setInputFiles([
        await pngFile('first.png', { color: '#1c8193' }),
        await pngFile('second.png', { color: '#b45309' }),
      ]);
    await expect(picker.getByText('تم اختيار صورتين')).toBeVisible();
    await picker.getByRole('button', { name: 'استخدام الصور المختارة' }).click();
    await expect(picker).toBeHidden();
    await expect(dialog.locator('img')).toHaveCount(2);
    await saveDialog(dialog);
    await expect(listRow(page, surgery).getByText('صورتان')).toBeVisible();

    await page.goto('/about');
    const gallery = page.locator('section', { hasText: 'نماذج من العمليات' });
    await gallery.getByRole('radio', { name: 'الأذن' }).click();
    await expect(gallery.getByText(surgery)).toHaveCount(0);
    await gallery.getByRole('radio', { name: 'الأنف' }).click();

    await gallery.getByRole('button', { name: `عرض صور ${surgery}` }).click();
    const lightbox = page.getByRole('dialog', { name: 'عرض الصور' });
    await expect(lightbox.getByText('1 من 2')).toBeVisible();
    await expect(lightbox.getByRole('button', { name: 'إغلاق' })).toBeFocused();
    // In Arabic the next photo is to the left.
    await page.keyboard.press('ArrowLeft');
    await expect(lightbox.getByText('2 من 2')).toBeVisible();
    await page.keyboard.press('ArrowRight');
    await expect(lightbox.getByText('1 من 2')).toBeVisible();
    await lightbox.getByRole('button', { name: 'الصورة التالية' }).click();
    await expect(lightbox.getByText('2 من 2')).toBeVisible();

    // In Arabic, swiping right shows the next photo (left in English).
    const photo = lightbox.locator('figure');
    await photo.dispatchEvent('pointerdown', { clientX: 200, isPrimary: true });
    await photo.dispatchEvent('pointerup', { clientX: 320, isPrimary: true });
    await expect(lightbox.getByText('1 من 2')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(lightbox).toBeHidden();
  });
});

test('staff do not see the media library or the About content', async ({ page }) => {
  await login(page, 'staff');
  const nav = page.getByRole('navigation', { name: 'أقسام لوحة التحكم' });
  await expect(nav.getByRole('link', { name: 'الحجوزات' })).toBeVisible();
  await expect(nav.getByRole('link', { name: 'مكتبة الصور' })).toHaveCount(0);
  await expect(nav.getByRole('link', { name: 'صفحة التعريف' })).toHaveCount(0);

  await page.goto('/dashboard/media');
  await expect(page).toHaveURL(/\/dashboard\/bookings$/);
});
