import { Link } from 'react-router';
import { Icon } from './Icon.jsx';

export const SectionLink = ({ to, children }) => (
  <Link to={to} className="press inline-flex items-center gap-1.5 font-bold text-primary-ink hover:text-ink-strong">
    {children}
    <Icon name="arrowForward" className="size-4.5" />
  </Link>
);
