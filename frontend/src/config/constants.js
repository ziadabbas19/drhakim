export const CAIRO_TIME_ZONE = 'Africa/Cairo';

export const PAGE_SIZE = 20;

export const MAX_PAGE_SIZE = 100;

export const MEDIA_PAGE_SIZE = 24;

// bcrypt ignores everything after 72 bytes, and Arabic letters take two bytes each.
export const PASSWORD_LENGTH = Object.freeze({ min: 8, maxBytes: 72 });

export const SLOT_DURATION = Object.freeze({ min: 5, max: 180 });

// Saturday first, as the Egyptian working week starts on Saturday.
export const WEEK_DAYS = Object.freeze([6, 0, 1, 2, 3, 4, 5]);

export const REVIEW_STATUS = Object.freeze({
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
});

// Mirrors the API limits in backend/src/config/constants.js.
export const REVIEW_LIMITS = Object.freeze({ textMin: 2, textMax: 60, commentMax: 600, maxRating: 5 });

export const BOOKING_STATUS = Object.freeze({
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
});

// Option labels live in the translation files under options.<group>.<value>.
export const OPTION_GROUPS = Object.freeze({
  bookingStatus: Object.values(BOOKING_STATUS),
  dayOffReason: ['vacation', 'surgery', 'holiday'],
  role: ['owner', 'staff'],
  serviceIcon: ['throat', 'nose', 'sinus', 'ear', 'hearing', 'voice', 'child', 'stethoscope'],
  surgeryCategory: ['nose', 'ear', 'throat'],
  reviewStatus: Object.values(REVIEW_STATUS),
});

export const OPTION_TONES = Object.freeze({
  bookingStatus: { pending: 'warning', confirmed: 'brand', completed: 'success', cancelled: 'danger' },
  role: { owner: 'brand', staff: 'neutral' },
  reviewStatus: { pending: 'warning', approved: 'success', rejected: 'neutral' },
});
