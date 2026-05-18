import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 px-6 text-center">
      {/* Ambient glow */}
      <div className="fixed top-[-20vh] left-[-10vw] w-[50vw] h-[50vw] rounded-full bg-accent-500/5 blur-3xl pointer-events-none" />

      <div className="relative">
        <h1 className="text-[120px] font-black text-zinc-800 leading-none select-none sm:text-[180px]">404</h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles size={40} className="text-accent-400/40 animate-pulse" />
        </div>
      </div>

      <h2 className="text-xl font-bold text-zinc-300 mt-4 mb-2">Página no encontrada</h2>
      <p className="text-sm text-zinc-600 max-w-sm mb-8">
        La página que buscas no existe o fue movida a otra dimensión.
      </p>

      <Link
        to="/"
        className="inline-flex items-center gap-2 rounded-xl bg-zinc-800 px-6 py-3 text-sm font-semibold text-zinc-200 transition-all hover:bg-zinc-700"
      >
        <ArrowLeft size={16} /> Volver al inicio
      </Link>
    </div>
  );
}
