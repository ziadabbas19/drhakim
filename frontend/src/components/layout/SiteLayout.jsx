import { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import { useI18n } from '../../hooks/useI18n.js';
import { PageTransition } from '../../motion/PageTransition.jsx';
import { ErrorBoundary } from '../ErrorBoundary.jsx';
import { Loader } from '../Loader.jsx';
import { Footer } from './Footer.jsx';
import { Navbar } from './Navbar.jsx';
import { WhatsAppButton } from './WhatsAppButton.jsx';

const useScrollToTopOnNavigate = (pathname) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
};

// Pages fade in when the top-level route changes; the dashboard animates its own sections.
const transitionKeyFor = (pathname) => pathname.split('/')[1] || 'home';

export const SiteLayout = ({ minimal = false }) => {
  const { t } = useI18n();
  const { pathname } = useLocation();
  useScrollToTopOnNavigate(pathname);

  return (
    // Sideways reveal animations start partly off-screen; clipping keeps them from widening the page.
    <div className="flex min-h-dvh flex-col overflow-x-clip">
      <a
        href="#main"
        className="sr-only z-50 rounded-lg bg-primary px-4 py-2 font-bold text-on-primary focus:not-sr-only focus:fixed focus:top-3 focus:inset-s-3"
      >
        {t('a11y.skipToContent')}
      </a>
      <Navbar />
      <main id="main" className="flex-1">
        {/* A page that fails to load or render shows a message here; the navbar and footer stay usable. */}
        <ErrorBoundary scope="page" resetKey={pathname}>
          <Suspense fallback={<Loader fullPage />}>
            <PageTransition transitionKey={transitionKeyFor(pathname)}>
              <Outlet />
            </PageTransition>
          </Suspense>
        </ErrorBoundary>
      </main>
      {!minimal && (
        <>
          <Footer />
          <WhatsAppButton />
        </>
      )}
    </div>
  );
};
