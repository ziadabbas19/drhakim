import { NavLink, Outlet, useLocation } from 'react-router';
import { Container } from '../../components/Container.jsx';
import { Icon } from '../../components/Icon.jsx';
import { IconTile } from '../../components/IconTile.jsx';
import { dashboardPath } from '../../config/navigation.js';
import { useAuth } from '../../hooks/useAuth.js';
import { useI18n } from '../../hooks/useI18n.js';
import { PageTransition } from '../../motion/PageTransition.jsx';
import { cn } from '../../utils/cn.js';
import { RoleBadge } from './RoleBadge.jsx';

const ITEM_CLASS =
  'press flex w-full items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-bold whitespace-nowrap lg:border-transparent';

export const DashboardLayout = ({ sections }) => {
  const { t } = useI18n();
  const { user, logout } = useAuth();
  const { pathname } = useLocation();

  return (
    <Container className="grid grid-cols-1 gap-6 py-6 lg:grid-cols-[15rem_minmax(0,1fr)] lg:py-10">
      <aside className="min-w-0 space-y-4 lg:sticky lg:top-24 lg:self-start">
        <div className="flex items-center gap-3 rounded-2xl bg-inverse p-4 text-on-inverse">
          <IconTile name="user" size="sm" className="bg-on-inverse/10 text-on-inverse" />
          <div className="min-w-0">
            <p className="truncate font-bold">{user.fullName}</p>
            <RoleBadge role={user.role} />
          </div>
        </div>
        <nav
          aria-label={t('dashboard.nav')}
          className="-mx-4 overflow-x-auto px-4 pb-1 lg:mx-0 lg:overflow-visible lg:px-0"
        >
          <ul className="flex gap-2 lg:flex-col">
            {sections.map(({ path, label, icon, Badge }) => (
              <li key={path}>
                <NavLink
                  to={dashboardPath(path)}
                  className={({ isActive }) =>
                    cn(
                      ITEM_CLASS,
                      isActive
                        ? 'border-primary bg-primary text-on-primary'
                        : 'border-line bg-surface text-ink-muted hover:bg-primary-faint hover:text-primary-ink',
                    )
                  }
                >
                  <Icon name={icon} className="size-4.5" />
                  {t(label)}
                  {Badge && <Badge />}
                </NavLink>
              </li>
            ))}
            <li>
              <button
                type="button"
                onClick={logout}
                className={cn(ITEM_CLASS, 'border-line bg-surface text-danger-ink hover:bg-danger-soft')}
              >
                <Icon name="logout" className="size-4.5" />
                {t('auth.logout')}
              </button>
            </li>
          </ul>
        </nav>
      </aside>
      <section className="min-w-0">
        <PageTransition transitionKey={pathname}>
          <Outlet />
        </PageTransition>
      </section>
    </Container>
  );
};
