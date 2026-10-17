// Permission keys mirror backend/src/config/permissions.js. Which role holds which permission
// is decided there only; the API returns the current user's list on login and /auth/me.
export const PERMISSIONS = Object.freeze({
  BOOKINGS_MANAGE: 'bookings:manage',
  CLINICS_VIEW: 'clinics:view',
  CLINICS_MANAGE: 'clinics:manage',
  SERVICES_MANAGE: 'services:manage',
  SETTINGS_MANAGE: 'settings:manage',
  TEAM_MANAGE: 'team:manage',
  MEDIA_MANAGE: 'media:manage',
  CONTENT_MANAGE: 'content:manage',
  REVIEWS_MANAGE: 'reviews:manage',
});

export const hasPermission = (user, permission) => !permission || Boolean(user?.permissions?.includes(permission));
