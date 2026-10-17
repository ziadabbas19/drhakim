import assert from 'node:assert/strict';
import { before, describe, test } from 'node:test';
import { api, loginAs, useTestServer } from './support/api.js';

useTestServer();

const ENGLISH = { lang: 'en' };
const RECEIVED = 'شكرًا لك! سيظهر تقييمك في الموقع بعد مراجعته والموافقة عليه';
const PUBLIC_FIELDS = ['city', 'comment', 'createdAt', 'id', 'patientName', 'rating'];

let owner;
before(async () => {
  owner = await loginAs('owner');
});

// Each submission comes from its own address unless a test chooses one, so the daily limit
// applies only where it is being tested.
let visitors = 0;
const nextAddress = () => {
  visitors += 1;
  return `10.20.${Math.floor(visitors / 250)}.${(visitors % 250) + 1}`;
};

let comments = 0;
const uniqueComment = () => {
  comments += 1;
  return `متابعة ممتازة وشرح واضح، رقم ${comments}`;
};

const newReview = (overrides = {}) => ({
  patientName: 'أحمد محمود',
  city: 'طنطا',
  rating: 5,
  comment: uniqueComment(),
  ...overrides,
});

const submit = (body, { address = nextAddress(), query = {} } = {}) =>
  api.post('/reviews', { body, query, headers: { 'X-Forwarded-For': address } });

const adminReviews = async (query = {}) =>
  (await api.get('/admin/reviews', { token: owner, query: { limit: 100, ...query } })).body.data.items;

const findStored = async (comment) =>
  (await adminReviews({ search: comment })).find((review) => review.comment === comment);

const moderate = (id, body) => api.patch(`/admin/reviews/${id}`, { token: owner, body });

const submitStored = async (overrides) => {
  const review = newReview(overrides);
  assert.equal((await submit(review)).status, 201);
  return findStored(review.comment);
};

const approved = async (overrides) => {
  const review = await submitStored(overrides);
  await moderate(review.id, { status: 'approved' });
  return review;
};

const publicIds = async () =>
  (await api.get('/reviews', { query: { limit: 100 } })).body.data.items.map(({ id }) => id);
const highlightIds = async () =>
  (await api.get('/reviews/highlights', { query: { limit: 12 } })).body.data.map(({ id }) => id);
const summary = async () => (await api.get('/reviews/summary')).body.data;

describe('Public reviews', () => {
  test('the site starts with no reviews', async () => {
    assert.deepEqual(await publicIds(), []);
    assert.deepEqual(await highlightIds(), []);
    assert.deepEqual(await summary(), { count: 0, average: null });
  });

  test('a submission is thanked and waits for approval', async () => {
    const review = newReview();
    const arabic = await submit(review);
    assert.equal(arabic.status, 201);
    assert.equal(arabic.body.message, RECEIVED);
    assert.equal(arabic.body.data, null);

    const english = await submit(newReview(), { query: ENGLISH });
    assert.equal(
      english.body.message,
      'Thank you! Your review will appear on the site after it has been checked and approved',
    );

    const stored = await findStored(review.comment);
    assert.equal(stored.status, 'pending');
    assert.equal(stored.isFeatured, false);
    assert.equal((await publicIds()).includes(stored.id), false);
  });

  test('pending reviews stay hidden; approved appear; rejected and deleted disappear', async () => {
    const review = await submitStored();
    const isPublic = async () => (await publicIds()).includes(review.id) && (await highlightIds()).includes(review.id);
    assert.equal(await isPublic(), false);

    await moderate(review.id, { status: 'approved' });
    assert.equal(await isPublic(), true);

    await moderate(review.id, { status: 'rejected' });
    assert.equal((await publicIds()).includes(review.id), false);

    await moderate(review.id, { status: 'approved' });
    assert.equal((await api.delete(`/admin/reviews/${review.id}`, { token: owner })).status, 200);
    assert.equal((await publicIds()).includes(review.id), false);
  });

  test('the public list carries only the safe fields', async () => {
    const review = await approved();
    const { body } = await api.get('/reviews', { query: { limit: 100 } });
    const item = body.data.items.find(({ id }) => id === review.id);
    assert.deepEqual(Object.keys(item).toSorted(), PUBLIC_FIELDS);
  });

  test('the average and count come from approved reviews only', async () => {
    await approved({ rating: 4 });
    await approved({ rating: 2 });
    await submitStored({ rating: 1 });
    await moderate((await submitStored({ rating: 1 })).id, { status: 'rejected' });

    const ratings = (await adminReviews({ status: 'approved' })).map(({ rating }) => rating);
    const expected = Math.round((ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length) * 10) / 10;
    assert.deepEqual(await summary(), { count: ratings.length, average: expected });
  });

  test('featured reviews lead; the latest are shown when none is featured', async () => {
    const older = await approved();
    const featured = await approved();
    await moderate(featured.id, { isFeatured: true });

    assert.deepEqual(await highlightIds(), [featured.id]);
    assert.equal((await publicIds())[0], featured.id);

    await moderate(featured.id, { isFeatured: false });
    const latest = await highlightIds();
    assert.equal(latest.length > 1, true);
    assert.equal(latest.includes(older.id), true);
  });

  test('public review data is cache-friendly and submissions are not cached', async () => {
    for (const path of ['/reviews', '/reviews/highlights', '/reviews/summary']) {
      const { headers } = await api.get(path);
      assert.match(headers.get('cache-control'), /public/);
      assert.ok(headers.get('etag'));
    }
    const { headers } = await submit(newReview());
    assert.equal(headers.get('cache-control'), 'no-store');
  });
});

describe('Submission rules', () => {
  test('every field is validated', async () => {
    const empty = await submit({}, { query: ENGLISH });
    assert.equal(empty.status, 400);
    assert.deepEqual(empty.body.data.fields, {
      patientName: 'Patient name is required',
      city: 'City is required',
      rating: 'Rating is required',
    });

    const cases = [
      [{ rating: 0 }, 'rating', 'Rating must be at least 1'],
      [{ rating: 6 }, 'rating', 'Rating must be at most 5'],
      [{ rating: 4.5 }, 'rating', 'Rating must be a whole number'],
      [{ patientName: 'a' }, 'patientName', 'Patient name must be at least 2 characters'],
      [{ patientName: 'ا'.repeat(61) }, 'patientName', 'Patient name must be at most 60 characters'],
      [{ city: ' ' }, 'city', 'City is required'],
      [{ comment: 'x'.repeat(601) }, 'comment', 'Comment must be at most 600 characters'],
      [{ patientName: '<b></b>' }, 'patientName', 'Patient name must be at least 2 characters'],
    ];
    for (const [overrides, field, message] of cases) {
      const { status, body } = await submit(newReview(overrides), { query: ENGLISH });
      assert.equal(status, 400, field);
      assert.equal(body.data.fields[field], message);
    }
  });

  test('HTML and control characters are removed and spaces collapsed', async () => {
    const marker = uniqueComment();
    const response = await submit(
      newReview({
        patientName: '  <b>سارة</b>    علي‮ ',
        city: 'Cairo\u0007',
        comment: `<p>Great <script>alert(1)</script>doctor</p>\n\n   thanks &amp; regards <3 ${marker}`,
      }),
    );
    assert.equal(response.status, 201);

    const stored = (await adminReviews({ search: marker }))[0];
    assert.equal(stored.patientName, 'سارة علي');
    assert.equal(stored.city, 'Cairo');
    assert.equal(stored.comment, `Great doctor thanks & regards <3 ${marker}`);
  });

  test('the comment is optional and text is kept in the language it was written in', async () => {
    const name = `Mona Hassan ${Date.now()}`;
    assert.equal((await submit({ patientName: name, city: 'Alexandria', rating: 4 })).status, 201);
    const stored = (await adminReviews({ search: name }))[0];
    assert.equal(stored.comment, null);
    assert.equal(stored.city, 'Alexandria');
  });

  test('a filled-in hidden field is accepted but not stored', async () => {
    const review = newReview({ website: 'https://spam.example' });
    const { status, body } = await submit(review);
    assert.equal(status, 201);
    assert.equal(body.message, RECEIVED);
    assert.equal(await findStored(review.comment), undefined);
  });

  test('the same review within a day is rejected', async () => {
    const review = newReview({ patientName: 'أحمد محمود' });
    assert.equal((await submit(review)).status, 201);

    // Same words with different spacing, letter forms, and punctuation.
    const repeated = await submit({ ...review, patientName: 'احمد  محمود', comment: `${review.comment}!` });
    assert.equal(repeated.status, 409);
    assert.equal(repeated.body.message, 'وصلنا هذا التقييم بالفعل، شكرًا لك');

    assert.equal((await submit({ ...review, comment: uniqueComment() })).status, 201);
  });

  test('each visitor may send a few reviews a day; rejected attempts do not count', async () => {
    const address = '198.51.100.7';
    assert.equal((await submit({}, { address })).status, 400);
    for (let attempt = 0; attempt < 3; attempt += 1) {
      assert.equal((await submit(newReview(), { address })).status, 201);
    }
    const limited = await submit(newReview(), { address });
    assert.equal(limited.status, 429);
    assert.equal(limited.body.message, 'شكرًا لك! أرسلت تقييمات كثيرة اليوم، يمكنك المحاولة مرة أخرى غدًا');
    assert.equal((await submit(newReview())).status, 201);
  });
});

describe('Moderation', () => {
  test('staff cannot reach the reviews dashboard', async () => {
    const staff = await loginAs('staff');
    const [review] = await adminReviews();
    const attempts = await Promise.all([
      api.get('/admin/reviews', { token: staff }),
      api.get('/admin/reviews/summary', { token: staff }),
      api.patch(`/admin/reviews/${review.id}`, { token: staff, body: { status: 'approved' } }),
      api.delete(`/admin/reviews/${review.id}`, { token: staff }),
    ]);
    assert.deepEqual(
      attempts.map(({ status }) => status),
      [403, 403, 403, 403],
    );

    const { body } = await api.get('/auth/me', { token: owner });
    assert.ok(body.data.permissions.includes('reviews:manage'));
  });

  test('status changes record who reviewed and when; featuring does not', async () => {
    const review = await submitStored();
    assert.equal(review.reviewedAt, null);

    const { body } = await moderate(review.id, { status: 'approved' });
    assert.ok(body.data.reviewedAt);
    assert.equal(body.data.reviewer.fullName, 'Test Owner');

    const featured = await moderate(review.id, { isFeatured: true });
    assert.equal(featured.body.data.reviewedAt, body.data.reviewedAt);
  });

  test('only approved reviews can be featured, and hiding one removes it from the home page', async () => {
    const pending = await submitStored();
    const rejected = await moderate(pending.id, { isFeatured: true });
    assert.equal(rejected.status, 400);
    assert.equal(rejected.body.message, 'يمكن تمييز التقييمات المنشورة فقط');

    await moderate(pending.id, { status: 'approved' });
    await moderate(pending.id, { isFeatured: true });
    const hidden = await moderate(pending.id, { status: 'rejected' });
    assert.equal(hidden.body.data.isFeatured, false);
  });

  test('the patient text cannot be changed', async () => {
    const review = await submitStored();
    const { status } = await moderate(review.id, { patientName: 'اسم آخر', comment: 'نص آخر' });
    assert.equal(status, 400);
    assert.equal((await findStored(review.comment)).patientName, review.patientName);
  });

  test('the list puts pending reviews first and can be filtered', async () => {
    const all = await adminReviews();
    const firstOther = all.findIndex(({ status }) => status !== 'pending');
    assert.ok(all.slice(firstOther).every(({ status }) => status !== 'pending'));

    const fives = await adminReviews({ rating: 5, status: 'approved' });
    assert.ok(fives.every(({ rating, status }) => rating === 5 && status === 'approved'));

    const { body } = await api.get('/admin/reviews/summary', { token: owner });
    const counts = Object.fromEntries(['pending', 'approved', 'rejected'].map((status) => [status, 0]));
    for (const { status } of all) counts[status] += 1;
    assert.deepEqual(body.data, counts);
  });

  test('the pending queue has a limit so the dashboard cannot be flooded', async () => {
    const { body } = await api.get('/admin/reviews/summary', { token: owner });
    const room = 25 - body.data.pending;
    const created = [];
    for (let index = 0; index < room; index += 1) {
      const review = newReview();
      assert.equal((await submit(review)).status, 201);
      created.push(review.comment);
    }

    const busy = await submit(newReview(), { query: ENGLISH });
    assert.equal(busy.status, 503);
    assert.equal(busy.body.message, 'We are receiving many reviews right now, please try again later');

    for (const comment of created) {
      await api.delete(`/admin/reviews/${(await findStored(comment)).id}`, { token: owner });
    }
    assert.equal((await submit(newReview())).status, 201);
  });
});
