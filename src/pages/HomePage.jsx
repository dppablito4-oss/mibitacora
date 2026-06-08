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

  const defaultOrder = ['expediente', 'modules', 'arsenal', 'proyectos', 'servicios', 'contacto'];
  
  // Filtrar solo las secciones que existen en el mapa y están activas (si quisiéramos ocultar alguna)
  const order = Array.isArray(sectionOrder) ? sectionOrder : defaultOrder;

  return (
    <div className="pt-20">
      <HeroSection profile={profile} avatarUrl={avatarUrl} aviso={aviso} />
      {order.map(sectionId => {
        // En el admin podemos definir deshabilitar una sección quitándola de la lista o enviando su id
        return sectionsMap[sectionId] || null;
      })}
    </div>
  );
}
