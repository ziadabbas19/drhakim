export const ROLES = Object.freeze({
  OWNER: 'owner',
  STAFF: 'staff',
});

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

// Edit this map to change what each role can do; the dashboard reads it through the auth API.
// Owners hold every permission, including the media library, the About page content, and review
// moderation. Add PERMISSIONS.REVIEWS_MANAGE to the staff list to let the assistant moderate reviews.
const ROLE_PERMISSIONS = Object.freeze({
  [ROLES.OWNER]: Object.values(PERMISSIONS),
  [ROLES.STAFF]: [PERMISSIONS.BOOKINGS_MANAGE, PERMISSIONS.CLINICS_VIEW],
});

export const getPermissions = (role) => ROLE_PERMISSIONS[role] ?? [];

export const hasPermission = (role, permission) => getPermissions(role).includes(permission);
