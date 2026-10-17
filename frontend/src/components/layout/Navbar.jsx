import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { PATHS, PUBLIC_LINKS } from '../../config/navigation.js';
import { useAuth } from '../../hooks/useAuth.js';
import { useI18n } from '../../hooks/useI18n.js';
import { BookingButton } from '../BookingButton.jsx';
import { Button } from '../Button.jsx';
import { Container } from '../Container.jsx';
import { Icon } from '../Icon.jsx';
import { Logo } from '../Logo.jsx';
import { LanguageSwitcher } from './LanguageSwitcher.jsx';
import { NavLinks } from './NavLinks.jsx';
import { ThemeSwitcher } from './ThemeSwitcher.jsx';

const DASHBOARD_LINK = { to: PATHS.dashboard, label: 'nav.dashboard' };

export const Navbar = () => {
  const { user } = useAuth();
  const { t } = useI18n();
  const { pathname } = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const links = user ? [...PUBLIC_LINKS, DASHBOARD_LINK] : PUBLIC_LINKS;

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/90 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-3">
        <Logo />
        <nav aria-label={t('a11y.mainMenu')} className="hidden xl:block">
          <NavLinks links={links} />
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <LanguageSwitcher />
          <ThemeSwitcher className="max-lg:hidden" />
          <BookingButton size="sm" className="max-sm:hidden" />
          <Button
            variant="ghost"
            size="icon"
            className="xl:hidden"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? t('a11y.closeMenu') : t('a11y.openMenu')}
            onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
          >
            <Icon name={isMenuOpen ? 'close' : 'menu'} className="size-6" />
          </Button>
        </div>
      </Container>

      {isMenuOpen && (
        <nav
          id="mobile-menu"
          aria-label={t('a11y.mainMenu')}
          className="pop-in border-t border-line bg-surface xl:hidden"
        >
          <Container className="space-y-3 py-3">
            <NavLinks links={links} vertical />
            <ThemeSwitcher className="lg:hidden" />
            <BookingButton className="w-full" />
          </Container>
        </nav>
      )}
    </header>
  );
};
