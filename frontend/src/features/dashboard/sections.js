import { PERMISSIONS } from '../../config/permissions.js';
import { AboutPanel } from '../about/admin/AboutPanel.jsx';
import { MediaPanel } from '../media/MediaPanel.jsx';
import { PendingReviewsBadge } from '../reviews/admin/ReviewCounts.jsx';
import { ReviewsPanel } from '../reviews/admin/ReviewsPanel.jsx';
import { AccountPanel } from './account/AccountPanel.jsx';
import { BookingsPanel } from './bookings/BookingsPanel.jsx';
import { ClinicDetailsPanel } from './clinics/ClinicDetailsPanel.jsx';
import { ClinicsPanel } from './clinics/ClinicsPanel.jsx';
import { ServicesPanel } from './services/ServicesPanel.jsx';
import { SettingsPanel } from './settings/SettingsPanel.jsx';
import { TeamPanel } from './team/TeamPanel.jsx';

// Labels are translation keys. A section appears only for users holding its permission, and may
// show a Badge next to its label in the menu.
export const DASHBOARD_SECTIONS = Object.freeze([
  {
    path: 'bookings',
    label: 'dashboard.sections.bookings',
    icon: 'calendarCheck',
    permission: PERMISSIONS.BOOKINGS_MANAGE,
    Panel: BookingsPanel,
  },
  {
    path: 'clinics',
    label: 'dashboard.sections.clinics',
    icon: 'building',
    permission: PERMISSIONS.CLINICS_VIEW,
    Panel: ClinicsPanel,
  },
  { path: 'clinics/:clinicId', permission: PERMISSIONS.CLINICS_VIEW, Panel: ClinicDetailsPanel, hidden: true },
  {
    path: 'services',
    label: 'dashboard.sections.services',
    icon: 'stethoscope',
    permission: PERMISSIONS.SERVICES_MANAGE,
    Panel: ServicesPanel,
  },
  {
    path: 'reviews',
    label: 'dashboard.sections.reviews',
    icon: 'star',
    permission: PERMISSIONS.REVIEWS_MANAGE,
    Panel: ReviewsPanel,
    Badge: PendingReviewsBadge,
  },
  {
    path: 'about',
    label: 'dashboard.sections.about',
    icon: 'user',
    permission: PERMISSIONS.CONTENT_MANAGE,
    Panel: AboutPanel,
  },
  {
    path: 'media',
    label: 'dashboard.sections.media',
    icon: 'images',
    permission: PERMISSIONS.MEDIA_MANAGE,
    Panel: MediaPanel,
  },
  {
    path: 'settings',
    label: 'dashboard.sections.settings',
    icon: 'settings',
    permission: PERMISSIONS.SETTINGS_MANAGE,
    Panel: SettingsPanel,
  },
  {
    path: 'team',
    label: 'dashboard.sections.team',
    icon: 'users',
    permission: PERMISSIONS.TEAM_MANAGE,
    Panel: TeamPanel,
  },
  { path: 'account', label: 'dashboard.sections.account', icon: 'userCog', Panel: AccountPanel },
]);
