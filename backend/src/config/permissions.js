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
});

// Edit this map to change what each role can do; the dashboard reads it through the auth API.
const ROLE_PERMISSIONS = Object.freeze({
  [ROLES.OWNER]: Object.values(PERMISSIONS),
  [ROLES.STAFF]: [PERMISSIONS.BOOKINGS_MANAGE, PERMISSIONS.CLINICS_VIEW],
});

export const getPermissions = (role) => ROLE_PERMISSIONS[role] ?? [];

export const hasPermission = (role, permission) => getPermissions(role).includes(permission);
