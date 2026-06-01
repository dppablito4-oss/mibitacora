import { SKILLS, PROJECTS, SERVICES } from '../data/siteData';
import { useSiteConfig } from '../lib/useSiteConfig';

import HeroSection from '../components/home/HeroSection';
import ExpedienteSection from '../components/home/ExpedienteSection';
import ModulosSection from '../components/home/ModulosSection';
import ArsenalSection from '../components/home/ArsenalSection';
import ProyectosSection from '../components/home/ProyectosSection';
import ServiciosSection from '../components/home/ServiciosSection';
import ContactoSection from '../components/home/ContactoSection';

export default function HomePage() {
  const { profile, avatarUrl, hobbies, aviso } = useSiteConfig();

  return (
    <div className="pt-20">
      <HeroSection profile={profile} avatarUrl={avatarUrl} aviso={aviso} />
      <ExpedienteSection profile={profile} hobbies={hobbies} />
      <ModulosSection />
      <ArsenalSection skills={SKILLS} />
      <ProyectosSection projects={PROJECTS} />
      <ServiciosSection services={SERVICES} />
      <ContactoSection profile={profile} />
    </div>
  );
}
