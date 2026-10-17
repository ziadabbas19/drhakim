import { NavLink } from 'react-router';
import { cn } from '../../utils/cn.js';

export const NavLinks = ({ links, vertical = false }) => (
  <ul className={cn('flex', vertical ? 'flex-col gap-1' : 'items-center gap-1')}>
    {links.map(({ to, label, end }) => (
      <li key={to}>
        <NavLink
          to={to}
          end={end}
          className={({ isActive }) =>
            cn(
              'block rounded-lg px-3 py-2 text-sm font-bold transition-colors',
              isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100 hover:text-brand-800',
            )
          }
        >
          {label}
        </NavLink>
      </li>
    ))}
  </ul>
);
