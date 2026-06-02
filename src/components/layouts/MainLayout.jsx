import { Outlet, useLocation } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import SpaceCopilot from '../SpaceCopilot';
import CookieBanner from '../CookieBanner';

export default function MainLayout() {
  const location = useLocation();
  const hidecopilot = ['/login', '/admin'].some(r => location.pathname.startsWith(r));
  const hideFooter = ['/login', '/admin', '/tripticos'].some(r => location.pathname.startsWith(r));

  return (
    <div className="relative min-h-screen bg-[#030712]">
      {/* Global ambient effects */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-[30%] right-0 h-[700px] w-[700px] rounded-full bg-tesseract-500/[0.07] blur-[120px]" />
        <div className="absolute -bottom-[20%] left-[10%] h-[500px] w-[500px] rounded-full bg-tesseract-600/[0.04] blur-[100px]" />
      </div>

      {!hidecopilot && <Header />}

      <main className="relative z-10">
        <Outlet />
      </main>

      {!hideFooter && <Footer />}
      {!hidecopilot && <SpaceCopilot />}
      <CookieBanner />
    </div>
  );
}
