import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, X } from 'lucide-react';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie_consent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-dark/95 border-t border-tesseract-500/30 backdrop-blur-md p-4 sm:p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-4">
          <ShieldAlert className="text-tesseract-500 shrink-0 mt-1 sm:mt-0" size={24} />
          <div>
            <h3 className="text-sm font-bold text-slate-200 mb-1">Aviso de Privacidad y Cookies</h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
              Este sitio utiliza almacenamiento local (cookies y localStorage) para guardar tu progreso en nuestras herramientas interactivas y mantener tu sesión activa. Al continuar navegando, aceptas nuestra{' '}
              <Link to="/terminos" className="text-tesseract-400 hover:text-tesseract-300 underline underline-offset-2">
                Política de Cookies y Términos de Uso
              </Link>.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={acceptCookies}
            className="flex-1 sm:flex-none px-6 py-2 bg-tesseract-600 hover:bg-tesseract-500 text-white font-bold text-sm uppercase tracking-wide rounded border border-tesseract-400/50 transition-colors whitespace-nowrap"
          >
            Aceptar
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="p-2 text-slate-500 hover:text-slate-300 transition-colors"
            title="Cerrar aviso temporalmente"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
