import { screen, waitFor, within } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { contentFor } from '../src/config/content.js';
import { ok, renderSite, text } from './support/site.jsx';

const { doctor } = contentFor('ar');

const image = (overrides) => ({
  id: 'photo',
  url: '/uploads/import-portrait.webp',
  width: 566,
  height: 566,
  alt: 'د. عبد الحكيم عبد السلام بالبالطو الأبيض',
  placeholder: 'data:image/webp;base64,AAAA',
  variants: [
    { width: 480, url: '/uploads/import-portrait-480.webp' },
    { width: 566, url: '/uploads/import-portrait.webp' },
  ],
  hasTransparency: false,
  focusX: null,
  focusY: null,
  ...overrides,
});

const aboutWith = ({ heroImage = null, stat = [] } = {}) =>
  ok({
    profile: { headline: '', intro: '', bio: '', heroImage, portrait: null, aboutGallery: [] },
    items: { qualification: [], timeline: [], membership: [], stat, surgery: [], result: [] },
  });

const renderHero = async (about) => {
  renderSite('/', { '/about': about });
  return (await screen.findByRole('heading', { level: 1, name: doctor.name })).closest('section');
};

describe('Home page hero', () => {
  test('a cut-out portrait stands on the brand shape, loads first, and slides in from the end side', async () => {
    const hero = await renderHero(aboutWith({ heroImage: image({ hasTransparency: true }) }));
    const photo = await within(hero).findByRole('img', { name: 'د. عبد الحكيم عبد السلام بالبالطو الأبيض' });

    expect(photo.getAttribute('width')).toBe('566');
    expect(photo.getAttribute('height')).toBe('566');
    expect(photo.getAttribute('srcset')).toContain('480w');
    expect(photo.getAttribute('sizes')).toBeTruthy();
    expect(photo.getAttribute('fetchpriority')).toBe('high');
    expect(photo.getAttribute('loading')).toBe('eager');
    expect(photo.className).toContain('object-contain');

    const stage = photo.closest('[data-portrait="cutout"]');
    expect(stage).toBeTruthy();
    // A transparent image shows the shape behind it: no grey backdrop or blurred placeholder.
    expect(photo.parentElement.className).not.toContain('bg-surface-sunken');
    expect(photo.parentElement.style.backgroundImage).toBe('');
    expect(photo.parentElement.className).toContain('float-after-reveal');
    expect(stage.closest('[data-reveal]').getAttribute('data-reveal')).toBe('end');
  });

  test('an ordinary photo fills a rounded frame, cropped around its focus point', async () => {
    const hero = await renderHero(aboutWith({ heroImage: image({ focusX: 40, focusY: 25 }) }));
    const photo = await within(hero).findByRole('img');

    expect(photo.closest('[data-portrait="cutout"]')).toBeNull();
    expect(photo.className).toContain('object-cover');
    expect(photo.style.objectPosition).toBe('40% 25%');
    expect(photo.parentElement.className).toContain('rounded-[2.5rem]');
    expect(photo.parentElement.style.backgroundImage).toContain('data:image/webp');
    expect(photo.getAttribute('fetchpriority')).toBe('high');
  });

  test('without a photo the illustrated card is shown and no number is made up', async () => {
    const hero = await renderHero(aboutWith());
    await waitFor(() => expect(within(hero).getByText(text('home.hero.clinics'))).toBeTruthy());

    expect(within(hero).queryAllByRole('img')).toHaveLength(0);
    expect(hero.querySelector('[data-portrait]')).toBeNull();
    expect(screen.queryByRole('definition')).toBeNull();
  });

  test('statistics appear only once the doctor adds them', async () => {
    renderSite('/', { '/about': aboutWith({ stat: [{ id: 's1', value: '12', title: 'إحصائية حقيقية' }] }) });
    expect(await screen.findAllByText('إحصائية حقيقية')).toHaveLength(2);
  });
});

describe('Structured data', () => {
  test('describes the doctor with confirmed details only', async () => {
    renderSite('/', {
      '/reviews/summary': ok({ count: 1, average: 5 }),
      '/reviews/highlights': ok([
        { id: 'r1', patientName: 'مريض', city: 'السنطة', rating: 5, comment: 'شكرًا', createdAt: '2026-10-01T10:00:00Z' },
      ]),
    });

    const script = await waitFor(() => {
      const element = document.getElementById('structured-data-reviews');
      expect(element).toBeTruthy();
      return element;
    });
    const data = JSON.parse(script.textContent);
    expect(data).toMatchObject({
      '@type': 'Physician',
      name: doctor.name,
      alternateName: doctor.knownAs,
      medicalSpecialty: 'Otolaryngologic',
      aggregateRating: { ratingValue: 5, reviewCount: 1 },
    });
    expect(script.textContent).not.toMatch(/استشاري|onsultant|طنطا|Tanta/);
  });
});
