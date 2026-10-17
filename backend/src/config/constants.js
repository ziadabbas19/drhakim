export const CAIRO_TIME_ZONE = 'Africa/Cairo';

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
