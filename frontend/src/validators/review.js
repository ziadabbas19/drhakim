import Joi from 'joi';
import { REVIEW_LIMITS } from '../config/constants.js';

const shortText = Joi.string().trim().min(REVIEW_LIMITS.textMin).max(REVIEW_LIMITS.textMax).required();

// Mirrors the API rules; the API also removes any HTML and stores plain text.
export const reviewSchema = Joi.object({
  patientName: shortText.label('reviewerName'),
  city: shortText,
  rating: Joi.number().integer().min(1).max(REVIEW_LIMITS.maxRating).empty(null).required(),
  comment: Joi.string().trim().max(REVIEW_LIMITS.commentMax).allow(''),
  website: Joi.string().allow(''),
});
