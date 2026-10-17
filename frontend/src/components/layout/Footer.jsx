import { Link } from 'react-router';
import { doctor } from '../../config/content.js';
import { PUBLIC_LINKS } from '../../config/navigation.js';
import { getContactChannels } from '../../features/settings/contactChannels.js';
import { SocialLinks } from '../../features/settings/SocialLinks.jsx';
import { useSiteSettings } from '../../hooks/useSiteSettings.js';
import { todayInCairo } from '../../utils/date.js';
import { BookingButton } from '../BookingButton.jsx';
import { Container } from '../Container.jsx';
import { Icon } from '../Icon.jsx';
import { Logo } from '../Logo.jsx';

const FooterHeading = ({ children }) => <h2 className="mb-4 text-sm font-extrabold text-white">{children}</h2>;

export const Footer = () => {
  const { settings } = useSiteSettings();
  const channels = getContactChannels(settings);

  return (
    <footer className="bg-brand-950 text-brand-100">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4 lg:col-span-2">
          <Logo inverted />
          <p className="max-w-md text-sm leading-relaxed text-brand-100/80">{doctor.tagline}</p>
          <SocialLinks inverted />
        </div>

        <div>
          <FooterHeading>روابط سريعة</FooterHeading>
          <ul className="space-y-2 text-sm">
            {PUBLIC_LINKS.map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className="transition-colors hover:text-white">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <FooterHeading>تواصل معنا</FooterHeading>
          <ul className="space-y-3 text-sm">
            {channels.map(({ key, icon, value, linkProps }) => (
              <li key={key}>
                <a {...linkProps} className="flex items-center gap-2 transition-colors hover:text-white">
                  <Icon name={icon} className="size-4.5 text-brand-300" />
                  <span dir="ltr">{value}</span>
                </a>
              </li>
            ))}
          </ul>
          {settings.workingHoursNote && <p className="text-xs leading-relaxed text-brand-100/70">{settings.workingHoursNote}</p>}
          <BookingButton variant="light" size="sm" />
        </div>
      </Container>
      <div className="border-t border-white/10 py-5 text-center text-xs text-brand-100/60">
        © {todayInCairo().slice(0, 4)} {doctor.name}. جميع الحقوق محفوظة.
      </div>
    </footer>
  );
};
