import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center" style={{ backgroundColor: '#050505' }}>
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(76,110,245,0.06) 0%, transparent 70%)', filter: 'blur(60px)' }} />

      <div className="relative">
        <h1 className="text-[100px] font-black text-white/[0.03] leading-none select-none sm:text-[160px] tracking-tighter">404</h1>
      </div>

      <h2 className="text-lg font-semibold text-white/60 -mt-4 mb-2">Página no encontrada</h2>
      <p className="text-sm text-white/20 max-w-sm mb-10">
        La página que buscas no existe o fue movida a otra dimensión.
      </p>

      <Link
        to="/"
        className="inline-flex items-center gap-2 rounded-xl border border-white/8 bg-white/4 px-5 py-2.5 text-sm font-medium text-white/50 transition-all hover:bg-white/8 hover:text-white/80"
      >
        <ArrowLeft size={15} /> Volver al inicio
      </Link>
    </div>
  );
}
