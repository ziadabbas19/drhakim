import { NavLink, Outlet } from 'react-router';
import { Container } from '../../components/Container.jsx';
import { Icon } from '../../components/Icon.jsx';
import { IconTile } from '../../components/IconTile.jsx';
import { dashboardPath } from '../../config/navigation.js';
import { useAuth } from '../../hooks/useAuth.js';
import { cn } from '../../utils/cn.js';
import { RoleBadge } from './RoleBadge.jsx';

const ITEM_CLASS =
  'flex w-full items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-bold whitespace-nowrap transition-colors lg:border-transparent';

export const DashboardLayout = ({ sections }) => {
  const { user, logout } = useAuth();

  return (
    <Container className="grid grid-cols-1 gap-6 py-6 lg:grid-cols-[15rem_minmax(0,1fr)] lg:py-10">
      <aside className="min-w-0 space-y-4 lg:sticky lg:top-24 lg:self-start">
        <div className="flex items-center gap-3 rounded-2xl bg-brand-950 p-4 text-white">
          <IconTile name="user" size="sm" className="bg-white/10 text-white" />
          <div className="min-w-0">
            <p className="truncate font-bold">{user.fullName}</p>
            <RoleBadge role={user.role} />
          </div>
        </div>
        <nav aria-label="أقسام لوحة التحكم" className="-mx-4 overflow-x-auto px-4 pb-1 lg:mx-0 lg:overflow-visible lg:px-0">
          <ul className="flex gap-2 lg:flex-col">
            {sections.map(({ path, label, icon }) => (
              <li key={path}>
                <NavLink
                  to={dashboardPath(path)}
                  className={({ isActive }) =>
                    cn(
                      ITEM_CLASS,
                      isActive
                        ? 'border-brand-600 bg-brand-600 text-white'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-brand-50 hover:text-brand-800',
                    )
                  }
                >
                  <Icon name={icon} className="size-4.5" />
                  {label}
                </NavLink>
              </li>
            ))}
            <li>
              <button
                type="button"
                onClick={logout}
                className={cn(ITEM_CLASS, 'border-slate-200 bg-white text-red-600 hover:bg-red-50')}
              >
                <Icon name="logout" className="size-4.5" />
                تسجيل الخروج
              </button>
            </li>
          </ul>
        </nav>
      </aside>
      <section className="min-w-0">
        <Outlet />
      </section>
    </Container>
  );
};
