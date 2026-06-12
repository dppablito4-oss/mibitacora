import { SKILLS } from '../data/siteData';
import { useSiteConfig } from '../lib/useSiteConfig';

import HeroSection from '../components/home/HeroSection';
import ExpedienteSection from '../components/home/ExpedienteSection';
import ModulosSection from '../components/home/ModulosSection';
import ArsenalSection from '../components/home/ArsenalSection';
import ProyectosSection from '../components/home/ProyectosSection';
import ServiciosSection from '../components/home/ServiciosSection';
import ContactoSection from '../components/home/ContactoSection';

export default function HomePage() {
  const { profile, avatarUrl, hobbies, aviso, sectionOrder, projects, services } = useSiteConfig();

  const sectionsMap = {
    expediente: <ExpedienteSection key="expediente" profile={profile} hobbies={hobbies} />,
    modules: <ModulosSection key="modules" />,
    arsenal: <ArsenalSection key="arsenal" skills={SKILLS} />,
    proyectos: <ProyectosSection key="proyectos" projects={projects} />,
    servicios: <ServiciosSection key="servicios" services={services} />,
    contacto: <ContactoSection key="contacto" profile={profile} />,
  };

  const defaultOrder = ['modules', 'proyectos', 'servicios', 'arsenal', 'expediente', 'contacto'];
  
  // Filtrar solo las secciones que existen en el mapa y están activas (si quisiéramos ocultar alguna)
  const order = Array.isArray(sectionOrder) ? sectionOrder : defaultOrder;

  return (
    <div className="pt-20">
      <HeroSection profile={profile} avatarUrl={avatarUrl} aviso={aviso} />
      {order.map((sectionId, i) => {
        const section = sectionsMap[sectionId];
        if (!section) return null;
        return (
          <div key={sectionId}>
            {/* Línea brillante separadora entre secciones */}
            {i > 0 && (
              <div className="relative h-px w-full">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-tesseract-500/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-tesseract-400/20 to-transparent blur-sm" />
              </div>
            )}
            {section}
          </div>
        );
      })}
    </div>
  );
}
