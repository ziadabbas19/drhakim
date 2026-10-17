import { NavLink } from 'react-router';
import { useI18n } from '../../hooks/useI18n.js';
import { cn } from '../../utils/cn.js';

export const NavLinks = ({ links, vertical = false }) => {
  const { t } = useI18n();

  return (
    <ul className={cn('flex', vertical ? 'flex-col gap-1' : 'items-center gap-1')}>
      {links.map(({ to, label, end }) => (
        <li key={to}>
          <NavLink
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'block rounded-lg px-2.5 py-2 text-sm font-bold whitespace-nowrap',
                isActive
                  ? 'bg-primary-faint text-primary-ink'
                  : 'text-ink-muted hover:bg-surface-sunken hover:text-ink-strong',
              )
            }
          >
            {t(label)}
          </NavLink>
        </li>
      ))}
    </ul>
  );
};
