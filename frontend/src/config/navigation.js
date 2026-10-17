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

export const PUBLIC_LINKS = Object.freeze([
  { to: PATHS.home, label: 'الرئيسية', end: true },
  { to: PATHS.about, label: 'عن الدكتور' },
  { to: PATHS.services, label: 'الخدمات' },
  { to: PATHS.clinics, label: 'العيادات' },
  { to: PATHS.contact, label: 'تواصل معنا' },
]);

export const bookingPathFor = (clinicId) => `${PATHS.booking}?clinic=${clinicId}`;

export const dashboardPath = (...segments) => [PATHS.dashboard, ...segments].join('/');
