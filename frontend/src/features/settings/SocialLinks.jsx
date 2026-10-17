import { Icon } from '../../components/Icon.jsx';
import { cn } from '../../utils/cn.js';
import { EXTERNAL_LINK_PROPS } from '../../utils/links.js';
import { useSocialLinks } from './contactChannels.js';

export const SocialLinks = ({ inverted = false }) => {
  const links = useSocialLinks();
  if (!links.length) return null;

  return (
    <ul className="flex flex-wrap gap-2">
      {links.map(({ key, icon, label, href }) => (
        <li key={key}>
          <a
            href={href}
            {...EXTERNAL_LINK_PROPS}
            aria-label={label}
            className={cn(
              'press grid size-10 place-items-center rounded-xl',
              inverted
                ? 'bg-on-inverse/10 text-on-inverse hover:bg-on-inverse/20'
                : 'bg-primary-soft text-primary-ink hover:bg-primary-line',
            )}
          >
            <Icon name={icon} />
          </a>
        </li>
      ))}
    </ul>
  );
};
