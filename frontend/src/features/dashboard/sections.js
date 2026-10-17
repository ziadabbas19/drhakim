import { PERMISSIONS } from '../../config/permissions.js';
import { AccountPanel } from './account/AccountPanel.jsx';
import { BookingsPanel } from './bookings/BookingsPanel.jsx';
import { ClinicDetailsPanel } from './clinics/ClinicDetailsPanel.jsx';
import { ClinicsPanel } from './clinics/ClinicsPanel.jsx';
import { ServicesPanel } from './services/ServicesPanel.jsx';
import { SettingsPanel } from './settings/SettingsPanel.jsx';
import { TeamPanel } from './team/TeamPanel.jsx';

export const DASHBOARD_SECTIONS = Object.freeze([
  { path: 'bookings', label: 'الحجوزات', icon: 'calendarCheck', permission: PERMISSIONS.BOOKINGS_MANAGE, Panel: BookingsPanel },
  { path: 'clinics', label: 'العيادات والمواعيد', icon: 'building', permission: PERMISSIONS.CLINICS_VIEW, Panel: ClinicsPanel },
  { path: 'clinics/:clinicId', permission: PERMISSIONS.CLINICS_VIEW, Panel: ClinicDetailsPanel, hidden: true },
  { path: 'services', label: 'الخدمات', icon: 'stethoscope', permission: PERMISSIONS.SERVICES_MANAGE, Panel: ServicesPanel },
  { path: 'settings', label: 'إعدادات التواصل', icon: 'settings', permission: PERMISSIONS.SETTINGS_MANAGE, Panel: SettingsPanel },
  { path: 'team', label: 'فريق العمل', icon: 'users', permission: PERMISSIONS.TEAM_MANAGE, Panel: TeamPanel },
  { path: 'account', label: 'حسابي', icon: 'userCog', Panel: AccountPanel },
]);
