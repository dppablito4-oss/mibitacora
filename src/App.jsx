import Header from './components/Header';
import Profile from './components/Profile';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="relative min-h-screen bg-zinc-950 selection:bg-accent-500/30 selection:text-white">
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
