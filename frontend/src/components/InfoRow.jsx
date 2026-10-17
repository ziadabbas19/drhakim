import { Icon } from './Icon.jsx';

export const InfoRow = ({ icon, children }) => (
  <li className="flex items-start gap-2.5">
    <Icon name={icon} className="mt-0.5 size-4.5 shrink-0 text-primary" />
    <span className="min-w-0 break-words">{children}</span>
  </li>
);
