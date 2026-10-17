import Joi from 'joi';
import { REVIEW_LIMITS, REVIEW_STATUSES } from '../config/constants.js';
import { toPlainText } from '../utils/plainText.js';
import { fields, paginationSchema } from './common.js';

const HIGHLIGHTS_LIMIT = Object.freeze({ default: 3, max: 12 });

// Cleaned to plain text first, so the length limits apply to what is actually stored.
const plainText = (max) =>
  Joi.string()
    .trim()
    .custom((value) => toPlainText(value))
    .max(max);

const shortText = plainText(REVIEW_LIMITS.textMax).min(REVIEW_LIMITS.textMin);

const status = Joi.string()
  .valid(...Object.values(REVIEW_STATUSES))
  .label('reviewStatus');

const rating = Joi.number().integer().min(REVIEW_LIMITS.ratingMin).max(REVIEW_LIMITS.ratingMax);

// `website` is a field people never see; automated form fillers complete it.
export const submitReviewSchema = Joi.object({
  patientName: shortText.required(),
  city: shortText.required(),
  rating: rating.required(),
  comment: plainText(REVIEW_LIMITS.commentMax).allow('', null),
  website: Joi.string().max(500).allow(''),
});

export const publicReviewQuerySchema = paginationSchema;

export const highlightsQuerySchema = Joi.object({
  limit: Joi.number().integer().min(1).max(HIGHLIGHTS_LIMIT.max).default(HIGHLIGHTS_LIMIT.default),
});

export const adminReviewQuerySchema = paginationSchema.keys({
  status,
  rating,
  search: fields.search,
});

// Moderation changes the status or the home page highlight only, never the patient's words.
export const reviewUpdateSchema = Joi.object({
  status,
  isFeatured: Joi.boolean().label('featuredReview'),
}).min(1);
