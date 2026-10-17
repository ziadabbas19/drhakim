import { Link } from 'react-router';
import { PUBLIC_LINKS } from '../../config/navigation.js';
import { useContactChannels } from '../../features/settings/contactChannels.js';
import { SocialLinks } from '../../features/settings/SocialLinks.jsx';
import { useContent } from '../../hooks/useContent.js';
import { useI18n } from '../../hooks/useI18n.js';
import { useSiteSettings } from '../../hooks/useSiteSettings.js';
import { todayInCairo } from '../../utils/date.js';
import { BookingButton } from '../BookingButton.jsx';
import { Container } from '../Container.jsx';
import { Icon } from '../Icon.jsx';
import { Logo } from '../Logo.jsx';
import { Ltr } from '../Ltr.jsx';

const FooterHeading = ({ children }) => <h2 className="mb-4 text-sm font-extrabold text-on-inverse">{children}</h2>;

export const Footer = () => {
  const { t } = useI18n();
  const { doctor } = useContent();
  const { settings } = useSiteSettings();
  const channels = useContactChannels();

  return (
    <footer className="bg-inverse text-on-inverse-muted">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4 lg:col-span-2">
          <Logo inverted />
          <p className="max-w-md text-sm leading-relaxed">{doctor.tagline}</p>
          <SocialLinks inverted />
        </div>

        <div>
          <FooterHeading>{t('footer.quickLinks')}</FooterHeading>
          <ul className="space-y-2 text-sm">
            {PUBLIC_LINKS.map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className="hover:text-on-inverse">
                  {t(label)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <FooterHeading>{t('footer.contact')}</FooterHeading>
          <ul className="space-y-3 text-sm">
            {channels.map(({ key, icon, value, linkProps }) => (
              <li key={key}>
                <a {...linkProps} className="flex items-center gap-2 hover:text-on-inverse">
                  <Icon name={icon} className="size-4.5" />
                  <Ltr>{value}</Ltr>
                </a>
              </li>
            ))}
          </ul>
          {settings.workingHoursNote && <p className="text-xs leading-relaxed">{settings.workingHoursNote}</p>}
          <BookingButton variant="light" size="sm" />
        </div>
      </Container>
      <div className="border-t border-on-inverse/10 py-5 text-center text-xs">
        {t('footer.rights', { year: todayInCairo().slice(0, 4), name: doctor.name })}
      </div>
    </footer>
  );
};
