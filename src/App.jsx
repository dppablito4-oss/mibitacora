import Header from './components/Header';
import Profile from './components/Profile';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Global background grain */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.015]">
        <svg width="100%" height="100%">
          <filter id="noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="4"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>

      <Header />

      <main className="relative z-10">
        <Profile />
        <Skills />
        <Projects />
        <Experience />
      </main>

      <Footer />
    </div>
  );
}
