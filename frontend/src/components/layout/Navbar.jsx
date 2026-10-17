import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { PATHS, PUBLIC_LINKS } from '../../config/navigation.js';
import { useAuth } from '../../hooks/useAuth.js';
import { BookingButton } from '../BookingButton.jsx';
import { Button } from '../Button.jsx';
import { Container } from '../Container.jsx';
import { Icon } from '../Icon.jsx';
import { Logo } from '../Logo.jsx';
import { NavLinks } from './NavLinks.jsx';

const DASHBOARD_LINK = { to: PATHS.dashboard, label: 'لوحة التحكم' };

export const Navbar = () => {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const links = user ? [...PUBLIC_LINKS, DASHBOARD_LINK] : PUBLIC_LINKS;

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/90 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-3">
        <Logo />
        <nav aria-label="القائمة الرئيسية" className="hidden lg:block">
          <NavLinks links={links} />
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <BookingButton size="sm" className="max-sm:hidden" />
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
            onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
          >
            <Icon name={isMenuOpen ? 'close' : 'menu'} className="size-6" />
          </Button>
        </div>
      </Container>

      {isMenuOpen && (
        <nav id="mobile-menu" aria-label="القائمة الرئيسية" className="border-t border-slate-100 bg-white lg:hidden">
          <Container className="space-y-3 py-3">
            <NavLinks links={links} vertical />
            <BookingButton className="w-full" />
          </Container>
        </nav>
      )}
    </header>
  );
};
