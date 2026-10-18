import { screen, within } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { ABOUT_SECTIONS } from '../src/features/about/aboutContent.js';
import { failure, htmlPage, ok, renderSite, text } from './support/site.jsx';

// What production sends: every group present and empty, no testimonial group (reviews have their own API).
const PRODUCTION_ABOUT = {
  profile: {
    headline: 'أخصائي وجراح الأنف والأذن والحنجرة',
    intro: 'ماجستير الأنف والأذن والحنجرة من جامعة الأزهر',
    bio: '<p>نبذة عن الدكتور</p>',
    heroImage: null,
    portrait: null,
    aboutGallery: [],
  },
  items: { qualification: [], timeline: [], membership: [], stat: [], surgery: [], result: [] },
};

const UNUSABLE_REVIEW_REPLIES = {
  "the website's HTML page": htmlPage(),
  'JSON without data': { status: 200, body: { success: true } },
};

const sectionTitled = async (title) =>
  (await screen.findByRole('heading', { level: 2, name: title })).closest('section');

const expectEverySectionEmpty = async () => {
  for (const { key, title } of ABOUT_SECTIONS) {
    expect(within(await sectionTitled(text(title))).getByText(text(`about.empty.${key}`))).toBeTruthy();
  }
};

const expectNothingCrashed = () => {
  expect(screen.queryByText(text('errors.crash.page'))).toBeNull();
  expect(screen.queryByText(text('errors.crash.section'))).toBeNull();
};

describe('About page', () => {
  test('the production reply shows the biography and an empty state in every section', async () => {
    renderSite('/about', { '/about': ok(PRODUCTION_ABOUT) });

    expect(await screen.findByRole('heading', { level: 2, name: PRODUCTION_ABOUT.profile.headline })).toBeTruthy();
    await expectEverySectionEmpty();
    expect(within(await sectionTitled(text('reviews.allTitle'))).getByText(text('reviews.empty'))).toBeTruthy();
    expectNothingCrashed();
  });

  test.each([
    ['an empty items object', ok({ profile: PRODUCTION_ABOUT.profile, items: {} })],
    ['no profile and no items', ok({})],
    ['no content at all', ok(null)],
  ])('%s shows an empty state in every section', async (_, reply) => {
    renderSite('/about', { '/about': reply });

    await expectEverySectionEmpty();
    expectNothingCrashed();
  });

  test('a failed request shows the error with a retry button, and the rest of the page still works', async () => {
    renderSite('/about', { '/about': failure(500, 'تعذر تحميل المحتوى') });

    expect(await screen.findByText('تعذر تحميل المحتوى')).toBeTruthy();
    expect(screen.getByRole('button', { name: text('common.retry') })).toBeTruthy();
    expect(within(await sectionTitled(text('reviews.allTitle'))).getByText(text('reviews.empty'))).toBeTruthy();
    expectNothingCrashed();
  });

  // The production crash: the reviews list read `data.items` while rendering.
  test.each(Object.entries(UNUSABLE_REVIEW_REPLIES))(
    'a reviews reply with %s shows an error in the reviews section only',
    async (_, reply) => {
      renderSite('/about', { '/about': ok(PRODUCTION_ABOUT), '/reviews': reply });

      const reviews = await sectionTitled(text('reviews.allTitle'));
      expect(await within(reviews).findByText(text('errors.unexpectedResponse'))).toBeTruthy();
      expect(within(reviews).getByRole('button', { name: text('common.retry') })).toBeTruthy();
      await expectEverySectionEmpty();
      expectNothingCrashed();
    },
  );

  test('reviews data that is null shows no reviews yet', async () => {
    renderSite('/about', { '/reviews': ok(null), '/reviews/summary': ok(null) });

    expect(within(await sectionTitled(text('reviews.allTitle'))).getByText(text('reviews.empty'))).toBeTruthy();
    expectNothingCrashed();
  });

  describe('when one section fails to render', () => {
    afterEach(() => vi.restoreAllMocks());

    test('it shows a message with a reload button there, and the other sections stay', async () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
      const about = {
        ...PRODUCTION_ABOUT,
        items: {
          ...PRODUCTION_ABOUT.items,
          qualification: [{ id: 1, title: { unexpected: 'an object instead of text' } }],
          timeline: [{ id: 2, title: 'عضو هيئة التدريس', subtitle: '2015' }],
        },
      };
      renderSite('/about', { '/about': ok(about) });

      const qualifications = await sectionTitled(text('about.qualifications'));
      expect(within(qualifications).getByRole('alert').textContent).toContain(text('errors.crash.section'));
      expect(within(qualifications).getByRole('button', { name: text('errors.crash.reload') })).toBeTruthy();
      expect(within(await sectionTitled(text('about.timeline.title'))).getByText('عضو هيئة التدريس')).toBeTruthy();
      expect(screen.getByRole('heading', { level: 2, name: PRODUCTION_ABOUT.profile.headline })).toBeTruthy();
      expect(screen.queryByText(text('errors.crash.page'))).toBeNull();
    });
  });
});

describe('Home page with the same About replies', () => {
  test.each([
    ['the production reply', ok(PRODUCTION_ABOUT)],
    ['an empty items object', ok({ profile: {}, items: {} })],
    ['no content at all', ok(null)],
    ['a failed request', failure(500, 'تعذر تحميل المحتوى')],
  ])('%s still renders the page', async (_, reply) => {
    renderSite('/', { '/about': reply });

    expect(await screen.findByRole('heading', { level: 1 })).toBeTruthy();
    expect(within(await sectionTitled(text('reviews.title'))).getByText(text('reviews.empty'))).toBeTruthy();
    expectNothingCrashed();
  });
});
