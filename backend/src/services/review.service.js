import { Op, col, fn, literal } from 'sequelize';
import { REVIEW_LIMITS, REVIEW_STATUSES } from '../config/constants.js';
import { env } from '../config/env.js';
import { messages } from '../i18n/index.js';
import { Review } from '../models/index.js';
import { ApiError } from '../utils/ApiError.js';
import { textFingerprint } from '../utils/plainText.js';
import { containsText } from '../utils/search.js';
import { createCrudService } from './crud.service.js';

const MS_PER_HOUR = 3_600_000;
const SERVICE_UNAVAILABLE = 503;

// Only these fields leave the API publicly.
const PUBLIC_ATTRIBUTES = Object.freeze(['id', 'patientName', 'city', 'rating', 'comment', 'createdAt']);
const APPROVED = Object.freeze({ status: REVIEW_STATUSES.APPROVED });
const NEWEST_FIRST = Object.freeze([['createdAt', 'DESC']]);

const PENDING_FIRST = literal(`CASE "Review"."status" WHEN '${REVIEW_STATUSES.PENDING}' THEN 0 ELSE 1 END`);

const buildReviewFilters = ({ status, rating, search }) => {
  const contains = search && containsText(search);
  return {
    ...(status && { status }),
    ...(rating && { rating }),
    ...(contains && { [Op.or]: [{ patientName: contains }, { city: contains }, { comment: contains }] }),
  };
};

const crud = createCrudService(Review, {
  include: [{ association: 'reviewer', attributes: ['id', 'fullName'] }],
  order: [[PENDING_FIRST, 'ASC'], ...NEWEST_FIRST],
  buildWhere: buildReviewFilters,
});

const findApproved = (where, options) =>
  Review.findAll({ where: { ...APPROVED, ...where }, attributes: PUBLIC_ATTRIBUTES, order: NEWEST_FIRST, ...options });

const assertNotDuplicate = async (fingerprint) => {
  const since = new Date(Date.now() - REVIEW_LIMITS.duplicateWindowHours * MS_PER_HOUR);
  if (await Review.count({ where: { fingerprint, createdAt: { [Op.gte]: since } } })) {
    throw ApiError.conflict(messages.reviews.duplicate);
  }
};

// Stops a flood of submissions from filling the moderation queue.
const assertQueueHasRoom = async () => {
  if ((await Review.count({ where: { status: REVIEW_STATUSES.PENDING } })) >= env.reviews.pendingCap) {
    throw new ApiError(SERVICE_UNAVAILABLE, messages.reviews.busy);
  }
};

export const reviewService = {
  // Every review waits for approval. A filled-in hidden field means an automated submission:
  // it gets the same answer as a real one but is not stored.
  async submit({ website, comment, ...review }) {
    if (website) return;
    const fingerprint = textFingerprint(review.patientName, comment);
    await assertNotDuplicate(fingerprint);
    await assertQueueHasRoom();
    await Review.create({ ...review, comment: comment || null, fingerprint });
  },

  // Featured reviews first, then the newest.
  async listApproved({ limit, offset }) {
    const { rows, count } = await Review.findAndCountAll({
      where: APPROVED,
      attributes: PUBLIC_ATTRIBUTES,
      order: [['isFeatured', 'DESC'], ...NEWEST_FIRST],
      limit,
      offset,
    });
    return { items: rows, total: count, limit, offset };
  },

  // The home page shows the featured reviews, or the latest ones when none are featured.
  async highlights(limit) {
    const featured = await findApproved({ isFeatured: true }, { limit });
    return featured.length ? featured : findApproved({}, { limit });
  },

  // Average (one decimal) and count of approved reviews only.
  async summary() {
    const [{ count, average }] = await Review.findAll({
      where: APPROVED,
      attributes: [
        [fn('COUNT', col('id')), 'count'],
        [fn('AVG', col('rating')), 'average'],
      ],
      raw: true,
    });
    const total = Number(count);
    return { count: total, average: total ? Math.round(Number(average) * 10) / 10 : null };
  },

  list: crud.list,
  remove: crud.remove,

  // Changes the status or the highlight only; the patient's words are never edited.
  async moderate(id, changes, moderator) {
    const review = await crud.findById(id);
    const status = changes.status ?? review.status;
    if (changes.isFeatured && status !== REVIEW_STATUSES.APPROVED) {
      throw ApiError.badRequest(messages.reviews.featureApprovedOnly);
    }
    await review.update({
      ...changes,
      ...(status !== review.status && { reviewedAt: new Date(), reviewedBy: moderator.id }),
      ...(status !== REVIEW_STATUSES.APPROVED && { isFeatured: false }),
    });
    return crud.findById(id);
  },

  async countByStatus() {
    const rows = await Review.findAll({
      attributes: ['status', [fn('COUNT', col('id')), 'count']],
      group: ['status'],
      raw: true,
    });
    return Object.fromEntries(
      Object.values(REVIEW_STATUSES).map((status) => [
        status,
        Number(rows.find((row) => row.status === status)?.count ?? 0),
      ]),
    );
  },
};
