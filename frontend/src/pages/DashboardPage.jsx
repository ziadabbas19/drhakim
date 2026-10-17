import { Navigate, Route, Routes } from 'react-router';
import { PATHS, dashboardPath } from '../config/navigation.js';
import { DashboardLayout } from '../features/dashboard/DashboardLayout.jsx';
import { DASHBOARD_SECTIONS } from '../features/dashboard/sections.js';
import { useAuth } from '../hooks/useAuth.js';

export default function DashboardPage() {
  const { can } = useAuth();
  const sections = DASHBOARD_SECTIONS.filter(({ permission }) => can(permission));
  const [firstSection] = sections;

  return (
    <Routes>
      <Route element={<DashboardLayout sections={sections.filter(({ hidden }) => !hidden)} />}>
        <Route index element={<Navigate to={dashboardPath(firstSection.path)} replace />} />
        {sections.map(({ path, Panel }) => (
          <Route key={path} path={path} element={<Panel />} />
        ))}
        <Route path="*" element={<Navigate to={PATHS.dashboard} replace />} />
      </Route>
    </Routes>
  );
}
