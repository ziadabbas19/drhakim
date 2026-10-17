export const PATHS = Object.freeze({
  home: '/',
  about: '/about',
  services: '/services',
  clinics: '/clinics',
  booking: '/book',
  contact: '/contact',
  login: '/login',
  changePassword: '/change-password',
  dashboard: '/dashboard',
});

// Labels are translation keys.
export const PUBLIC_LINKS = Object.freeze([
  { to: PATHS.home, label: 'nav.home', end: true },
  { to: PATHS.about, label: 'nav.about' },
  { to: PATHS.services, label: 'nav.services' },
  { to: PATHS.clinics, label: 'nav.clinics' },
  { to: PATHS.contact, label: 'nav.contact' },
]);

export const bookingPathFor = (clinicId) => `${PATHS.booking}?clinic=${clinicId}`;

export const dashboardPath = (...segments) => [PATHS.dashboard, ...segments].join('/');
