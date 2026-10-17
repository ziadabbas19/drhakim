import { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import { Loader } from '../Loader.jsx';
import { Footer } from './Footer.jsx';
import { Navbar } from './Navbar.jsx';
import { WhatsAppButton } from './WhatsAppButton.jsx';

const useScrollToTopOnNavigate = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
};

export const SiteLayout = ({ minimal = false }) => {
  useScrollToTopOnNavigate();

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only z-50 rounded-lg bg-brand-700 px-4 py-2 font-bold text-white focus:not-sr-only focus:fixed focus:top-3 focus:inset-s-3"
      >
        تخطَّ إلى المحتوى
      </a>
      <Navbar />
      <main id="main" className="flex-1">
        <Suspense fallback={<Loader fullPage />}>
          <Outlet />
        </Suspense>
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
