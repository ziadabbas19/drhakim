import { expect, test } from '@playwright/test';
import { login, pngFile, uniqueText } from '../support.js';

const fileInput = (scope) => scope.getByTestId('media-file-input');

const libraryTiles = (page) =>
  page.getByRole('listitem').filter({ has: page.getByRole('button', { name: 'النص البديل' }) });

// Uploads one image and waits for it to appear first in the library (newest first).
const uploadImage = async (page, file) => {
  const before = await libraryTiles(page).count();
  await fileInput(page).setInputFiles(file);
  await expect(page.getByText('تم رفع الصور بنجاح')).toBeVisible();
  await expect(libraryTiles(page)).toHaveCount(before + 1);
  return libraryTiles(page).first();
};

test.describe('Media library', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/dashboard/media');
    // The hint appears once the upload limits have arrived with the library.
    await expect(page.getByText(/حتى 1 ميجابايت للصورة/)).toBeVisible();
  });

  test('files of the wrong type or size are rejected, and the server checks the real content', async ({ page }) => {
    await fileInput(page).setInputFiles({
      name: 'animation.gif',
      mimeType: 'image/gif',
      buffer: Buffer.from('GIF89a'),
    });
    await expect(page.getByText('animation.gif: يُسمح فقط بصور JPEG أو PNG أو WebP')).toBeVisible();

    await fileInput(page).setInputFiles({
      name: 'large.png',
      mimeType: 'image/png',
      buffer: Buffer.alloc(1.2 * 1024 * 1024, 1),
    });
    await expect(page.getByText('large.png: حجم الصورة يجب ألا يزيد عن 1 ميجابايت')).toBeVisible();

    await fileInput(page).setInputFiles({
      name: 'disguised.png',
      mimeType: 'image/png',
      buffer: Buffer.from('not an image'),
    });
    await expect(page.getByText('محتوى الملف ليس صورة JPEG أو PNG أو WebP صالحة')).toBeVisible();
  });

  test('images are uploaded and their alt text is edited in both languages', async ({ page }) => {
    const alt = uniqueText('صورة الاستقبال');
    const tile = await uploadImage(page, await pngFile('reception.png'));
    await tile.getByRole('button', { name: 'النص البديل' }).click();
    const dialog = page.getByRole('dialog', { name: 'النص البديل للصورة' });
    await dialog.getByRole('button', { name: 'حفظ', exact: true }).click();
    await expect(dialog.getByText('حقل النص البديل بالعربية مطلوب')).toBeVisible();

    await dialog.getByLabel('النص البديل (عربي)').fill(alt);
    await dialog.getByLabel('النص البديل (إنجليزي)').fill('Reception desk');
    await dialog.getByRole('button', { name: 'حفظ', exact: true }).click();
    await expect(dialog).toBeHidden();
    await expect(page.getByText(alt)).toBeVisible();
  });

  test('an image used on the site is only deleted after an explicit second confirmation', async ({ page }) => {
    const alt = uniqueText('غلاف للاختبار');
    const uploaded = await uploadImage(page, await pngFile('cover.png', { width: 1600, height: 900 }));
    await uploaded.getByRole('button', { name: 'النص البديل' }).click();
    const altDialog = page.getByRole('dialog', { name: 'النص البديل للصورة' });
    await altDialog.getByLabel('النص البديل (عربي)').fill(alt);
    await altDialog.getByRole('button', { name: 'حفظ', exact: true }).click();
    await expect(altDialog).toBeHidden();

    await page.goto('/dashboard/clinics');
    await page
      .getByRole('row', { name: /عيادة السنطة/ })
      .getByRole('button', { name: 'تعديل' })
      .click();
    const clinicDialog = page.getByRole('dialog', { name: /تعديل عيادة السنطة/ });
    await clinicDialog.getByRole('button', { name: 'اختيار صورة' }).first().click();
    const picker = page.getByRole('dialog', { name: 'اختر من مكتبة الصور' });
    await picker.getByRole('button', { name: `اختيار ${alt}` }).click();
    await picker.getByRole('button', { name: 'استخدام الصورة' }).click();
    await clinicDialog.getByRole('button', { name: 'حفظ', exact: true }).click();
    await expect(clinicDialog).toBeHidden();

    await page.goto('/clinics');
    await expect(page.getByRole('img', { name: alt })).toBeVisible();
    const cover = page.getByRole('img', { name: alt });
    await expect(cover).toHaveAttribute('srcset', /480w/);
    await expect(cover).toHaveAttribute('loading', 'lazy');
    await expect(cover).toHaveAttribute('width', '1600');

    await page.goto('/dashboard/media');
    const tile = page.getByRole('listitem').filter({ hasText: alt });
    await expect(tile.getByText('مستخدمة في مكان واحد')).toBeVisible();
    await tile.getByRole('button', { name: 'حذف' }).click();
    await page.getByRole('dialog', { name: 'حذف الصورة' }).getByRole('button', { name: 'حذف' }).click();

    const inUse = page.getByRole('dialog', { name: 'الصورة مستخدمة في الموقع' });
    await expect(inUse.getByText('غلاف عيادة السنطة')).toBeVisible();
    await inUse.getByRole('button', { name: 'حذف وإزالتها من الموقع' }).click();
    await expect(page.getByText('تم الحذف بنجاح')).toBeVisible();
    await expect(page.getByText(alt)).toHaveCount(0);

    await page.goto('/clinics');
    await expect(page.getByRole('img', { name: alt })).toHaveCount(0);
  });
});
