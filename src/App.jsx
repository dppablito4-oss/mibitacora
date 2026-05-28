import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ScannerPage from './pages/ScannerPage';

export default function App() {
  // Scroll-reveal observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -50px 0px' }
    );

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative min-h-screen bg-[#030712]">
      {/* Global ambient effects */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-[30%] right-0 h-[700px] w-[700px] rounded-full bg-tesseract-500/[0.07] blur-[120px]" />
        <div className="absolute -bottom-[20%] left-[10%] h-[500px] w-[500px] rounded-full bg-tesseract-600/[0.04] blur-[100px]" />
      </div>

      <Header />

      <main className="relative z-10">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/scanner" element={<ScannerPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
