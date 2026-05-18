import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollUp = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <button
      onClick={scrollUp}
      aria-label="Volver arriba"
      className={`fixed bottom-6 left-6 z-40 w-10 h-10 rounded-full border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm flex items-center justify-center text-zinc-500 hover:text-zinc-200 hover:border-zinc-600 hover:bg-zinc-800 transition-all duration-300 shadow-lg ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <ArrowUp size={16} />
    </button>
  );
}
