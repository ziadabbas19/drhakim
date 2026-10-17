export const CAIRO_TIME_ZONE = 'Africa/Cairo';

export const LANGUAGES = Object.freeze(['ar', 'en']);

export const DEFAULT_LANGUAGE = 'ar';

export const DISPLAY_LOCALES = Object.freeze({ ar: 'ar-EG', en: 'en-US' });

export const MEDIA = Object.freeze({
  mimeTypes: Object.freeze(['image/jpeg', 'image/png', 'image/webp']),
  maxFilesPerUpload: 10,
  maxGallerySize: 30,
  // Uploads are resized to fit this box and stored as WebP, with smaller copies for srcset.
  maxDimension: 2000,
  variantWidths: Object.freeze([480, 960, 1440]),
  quality: 80,
  placeholderWidth: 16,
  // Rejects decompression bombs before they are decoded.
  maxInputPixels: 40_000_000,
});

export const ABOUT_ITEM_TYPES = Object.freeze({
  QUALIFICATION: 'qualification',
  TIMELINE: 'timeline',
  MEMBERSHIP: 'membership',
  STAT: 'stat',
  SURGERY: 'surgery',
});

export const SURGERY_CATEGORIES = Object.freeze(['nose', 'ear', 'throat']);

export const RICH_TEXT_MAX_LENGTH = 20_000;

export const REVIEW_STATUSES = Object.freeze({
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
});

export const REVIEW_LIMITS = Object.freeze({
  textMin: 2,
  textMax: 60,
  commentMax: 600,
  ratingMin: 1,
  ratingMax: 5,
  duplicateWindowHours: 24,
});

export const BOOKING_WINDOW_DAYS = 30;

export const BOOKING_STATUSES = Object.freeze({
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
});

export const UPCOMING_BOOKING_STATUSES = Object.freeze([BOOKING_STATUSES.PENDING, BOOKING_STATUSES.CONFIRMED]);

export const DAY_OFF_REASONS = Object.freeze(['vacation', 'surgery', 'holiday']);

export const SLOT_DURATION = Object.freeze({ min: 5, max: 180 });

// bcrypt ignores everything after 72 bytes, and Arabic letters take two bytes each.
export const PASSWORD_LENGTH = Object.freeze({ min: 8, maxBytes: 72 });

export const PAGINATION = Object.freeze({ defaultLimit: 20, maxLimit: 100 });

export const UNIQUE_CONSTRAINTS = Object.freeze({
  BOOKING_SLOT: 'bookings_slot_unique',
  BOOKING_REFERENCE: 'bookings_reference_code_unique',
  DAY_OFF_DATE: 'clinic_days_off_date_unique',
  USER_EMAIL: 'users_email_unique',
});

export const FOREIGN_KEYS = Object.freeze({
  MEDIA_LINK_MEDIA: 'media_links_media_id_fkey',
});
