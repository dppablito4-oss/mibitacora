import { Shield, FileText, Database } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-dark text-slate-300 pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <Link to="/" className="text-tesseract-400 hover:text-tesseract-300 text-sm font-bold uppercase tracking-wider mb-6 inline-block">
            ← Volver al Inicio
          </Link>
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4">Términos y Privacidad</h1>
          <p className="text-slate-400 text-lg">Información sobre el uso de datos, cookies y regulaciones de la plataforma.</p>
        </div>

        <div className="space-y-12">
          {/* Section 1: Cookies */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-tesseract-500/10 rounded-lg">
                <Database className="text-tesseract-400" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-white">Uso de Cookies y Almacenamiento Local</h2>
            </div>
            <div className="space-y-4 text-slate-300 leading-relaxed">
              <p>
                Este sitio web utiliza tecnologías de almacenamiento local en tu navegador (Local Storage) y cookies estrictamente necesarias para el correcto funcionamiento de las herramientas interactivas.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-slate-400">
                <li><strong className="text-slate-200">Guardado Automático:</strong> Herramientas como el <em>Tríptico Maker</em> guardan tu progreso localmente en tu dispositivo para que no pierdas tu trabajo si recargas la página.</li>
                <li><strong className="text-slate-200">Preferencias de Usuario:</strong> Recordamos si has aceptado este aviso para no molestarte nuevamente.</li>
                <li><strong className="text-slate-200">Autenticación:</strong> Supabase utiliza cookies seguras para mantener tu sesión activa si decides iniciar sesión en el panel de administración.</li>
              </ul>
              <p className="text-sm text-slate-500 mt-4">
                No utilizamos cookies de seguimiento de terceros ni vendemos tu información de navegación a anunciantes.
              </p>
            </div>
          </section>

          {/* Section 2: AI */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <Shield className="text-purple-400" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-white">Uso de Inteligencia Artificial</h2>
            </div>
            <div className="space-y-4 text-slate-300 leading-relaxed">
              <p>
                Nuestra plataforma integra asistentes de Inteligencia Artificial (A.L.P.H.A. / DeepSeek) para generar contenido y responder consultas.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-slate-400">
                <li>El contenido generado por la IA es automatizado. Recomendamos revisar toda la información generada antes de utilizarla en entornos académicos o profesionales.</li>
                <li>Los prompts y textos que ingresas en el chat o en las herramientas generativas son procesados por APIs de terceros bajo sus propias políticas de privacidad.</li>
                <li>No compartas información personal sensible, contraseñas o datos financieros a través del chat de la IA.</li>
              </ul>
            </div>
          </section>

          {/* Section 3: General Terms */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-emerald-500/10 rounded-lg">
                <FileText className="text-emerald-400" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-white">Términos de Uso</h2>
            </div>
            <div className="space-y-4 text-slate-300 leading-relaxed">
              <p>
                Al utilizar este sitio web y sus herramientas (Generador QR, Resolutor Matemático, Creador de Trípticos), aceptas utilizarlas bajo tu propio riesgo. Las herramientas se proporcionan "tal cual" sin garantías explícitas de funcionamiento ininterrumpido.
              </p>
              <p>
                Nos reservamos el derecho de modificar o retirar cualquier herramienta gratuita en cualquier momento para mantener la estabilidad del servidor.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
