import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import SpaceCopilot from '../SpaceCopilot';
import ScrollToTop from '../ScrollToTop';
import CookieBanner from '../CookieBanner';
import SpaceBackground from '../SpaceBackground';
import { useSiteConfig } from '../../lib/useSiteConfig';

export default function MainLayout() {
  const location = useLocation();
  const { theme } = useSiteConfig();
  const isFullscreenPage = ['/login', '/admin'].some(r => location.pathname.startsWith(r));
  const hideFooter = ['/login', '/admin', '/tripticos', '/scanner'].some(r => location.pathname.startsWith(r));

  useEffect(() => {
    const isLight = theme?.mode === 'light';
    if (isLight) {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
  }, [theme?.mode]);

  return (
    <div className="relative min-h-screen bg-dark transition-colors duration-300">
      {/* Fondo espacial interactivo */}
      <SpaceBackground theme={theme} />

      {!isFullscreenPage && <Header />}

      <main className="relative z-10">
        <Outlet />
      </main>

      {!hideFooter && <Footer />}
      {!isFullscreenPage && <SpaceCopilot />}
      <ScrollToTop />
      <CookieBanner />
    </div>
  );
}
