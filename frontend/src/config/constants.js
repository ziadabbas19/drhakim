export const CAIRO_TIME_ZONE = 'Africa/Cairo';

// Arabic text with Western digits, matching how phone numbers are written across the site.
export const DISPLAY_LOCALE = 'ar-EG-u-nu-latn';

export const PAGE_SIZE = 20;

export const MAX_PAGE_SIZE = 100;

// bcrypt ignores everything after 72 bytes, and Arabic letters take two bytes each.
export const PASSWORD_LENGTH = Object.freeze({ min: 8, maxBytes: 72 });

export const SLOT_DURATION = Object.freeze({ min: 5, max: 180 });

// Saturday first, as the Egyptian working week starts on Saturday.
export const WEEK_DAYS = Object.freeze([6, 0, 1, 2, 3, 4, 5]);

export const BOOKING_STATUS = Object.freeze({
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
});

export const BOOKING_STATUS_OPTIONS = Object.freeze([
  { value: BOOKING_STATUS.PENDING, label: 'بانتظار التأكيد', tone: 'warning' },
  { value: BOOKING_STATUS.CONFIRMED, label: 'مؤكد', tone: 'brand' },
  { value: BOOKING_STATUS.COMPLETED, label: 'تم الكشف', tone: 'success' },
  { value: BOOKING_STATUS.CANCELLED, label: 'ملغي', tone: 'danger' },
]);

export const DAY_OFF_REASON_OPTIONS = Object.freeze([
  { value: 'vacation', label: 'إجازة' },
  { value: 'surgery', label: 'يوم عمليات' },
  { value: 'holiday', label: 'عطلة رسمية' },
]);

export const ROLE_OPTIONS = Object.freeze([
  { value: 'owner', label: 'مالك', tone: 'brand' },
  { value: 'staff', label: 'مساعد', tone: 'neutral' },
]);

export const SERVICE_ICON_OPTIONS = Object.freeze([
  { value: 'throat', label: 'الحلق' },
  { value: 'nose', label: 'الأنف' },
  { value: 'sinus', label: 'الجيوب الأنفية' },
  { value: 'ear', label: 'الأذن' },
  { value: 'hearing', label: 'السمع' },
  { value: 'voice', label: 'الصوت' },
  { value: 'child', label: 'الأطفال' },
  { value: 'stethoscope', label: 'كشف عام' },
]);

export const findOption = (options, value) => options.find((option) => option.value === value);
