import { Link } from 'react-router';
import { Icon } from './Icon.jsx';

export const SectionLink = ({ to, children }) => (
  <Link to={to} className="inline-flex items-center gap-1.5 font-bold text-brand-700 hover:text-brand-900">
    {children}
    <Icon name="arrowForward" className="size-4.5" />
  </Link>
);
