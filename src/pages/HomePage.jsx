import Header from '../components/Header';
import Profile from '../components/Profile';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import Bitacora from '../components/Bitacora';
import Experience from '../components/Experience';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import { useEffect } from 'react';
import { trackPageView } from '../lib/analytics';

export default function HomePage() {
  useEffect(() => {
    trackPageView('/');
  }, []);

  return (
    <div className="relative min-h-screen bg-zinc-950 selection:bg-accent-500/30 selection:text-white">
      {/* Ambient lighting (inspired by pablitoexpo) */}
      <div className="fixed top-[-15vw] left-[-10vw] w-[45vw] h-[45vw] rounded-full pointer-events-none z-0" style={{ background: 'radial-gradient(circle, rgba(51,129,255,0.06) 0%, transparent 70%)' }} />
      <div className="fixed bottom-[-15vw] right-[-10vw] w-[40vw] h-[40vw] rounded-full pointer-events-none z-0" style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.04) 0%, transparent 70%)' }} />

      <Header />

      <main className="relative z-10">
        <Profile />
        <Skills />
        <Projects />
        <Bitacora />
        <Experience />
        <ContactForm />
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
}
