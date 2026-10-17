import { Icon } from '../../components/Icon.jsx';
import { useSiteSettings } from '../../hooks/useSiteSettings.js';
import { cn } from '../../utils/cn.js';
import { EXTERNAL_LINK_PROPS } from '../../utils/links.js';
import { getSocialLinks } from './contactChannels.js';

export const SocialLinks = ({ inverted = false }) => {
  const { settings } = useSiteSettings();
  const links = getSocialLinks(settings);
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
              'grid size-10 place-items-center rounded-xl transition-colors',
              inverted ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-brand-50 text-brand-700 hover:bg-brand-100',
            )}
          >
            <Icon name={icon} />
          </a>
        </li>
      ))}
    </ul>
  );
};
