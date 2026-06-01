import { motion } from 'framer-motion';
import { Terminal, ShieldCheck, Cpu } from 'lucide-react';

export default function ExpedienteSection({ profile, hobbies }) {
  const moduleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section id="expediente" className="relative border-y border-tesseract-500/10 bg-card/40 py-20">
      <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-tesseract-500/50 to-transparent"></div>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={moduleVariants}
          className="mx-auto mb-12 max-w-3xl text-center"
        >
          <h2 className="text-glow mb-4 text-3xl font-bold uppercase tracking-widest text-white md:text-4xl">Expediente Clasificado</h2>
          <div className="mx-auto mb-8 h-1 w-24 bg-tesseract-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
          
          <div className="mx-auto max-w-2xl bg-dark/80 border border-tesseract-500/30 p-6 shadow-[0_0_20px_rgba(6,182,212,0.1)] text-left mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border-b border-slate-800 pb-2">
                <span className="block text-xs text-tesseract-500 uppercase tracking-widest font-bold mb-1">Nombre Clave</span>
                <span className="text-slate-200 font-mono text-sm">{profile.name}</span>
              </div>
              <div className="border-b border-slate-800 pb-2">
                <span className="block text-xs text-tesseract-500 uppercase tracking-widest font-bold mb-1">Especialidad</span>
                <span className="text-slate-200 font-mono text-sm">{profile.tagline}</span>
              </div>
              <div className="border-b md:border-b-0 border-slate-800 pb-2 md:pb-0">
                <span className="block text-xs text-tesseract-500 uppercase tracking-widest font-bold mb-1">Fecha de Nacimiento</span>
                <span className="text-slate-200 font-mono text-sm">{profile.birth}</span>
              </div>
              <div>
                <span className="block text-xs text-tesseract-500 uppercase tracking-widest font-bold mb-1">Sexo</span>
                <span className="text-slate-200 font-mono text-sm">{profile.gender}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {hobbies.length > 0 && (
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={moduleVariants}
            className="mb-16"
          >
            <h3 className="text-glow mb-6 text-xl font-bold uppercase tracking-widest text-white text-center">Intereses & Hobbies</h3>
            <div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-3">
              {hobbies.map((hobby, i) => (
                <motion.div
                  key={hobby.id || i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`group flex items-center gap-3 border border-tesseract-500/20 bg-dark/80 px-5 py-3 transition-all hover:border-tesseract-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]`}
                >
                  <span className="text-xl">{hobby.emoji}</span>
                  <div>
                    <span className="text-sm font-medium text-slate-200">{hobby.name}</span>
                    {hobby.description && (
                      <p className="text-[11px] text-slate-500">{hobby.description}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {[
            { icon: Terminal, title: 'Frontend Core', desc: 'Arquitectura de interfaces reactivas y sistemas de componentes para misiones de alta prioridad.', borderColor: 'border-tesseract-500/20', hoverBorder: 'hover:border-tesseract-500', bgCorner: 'bg-tesseract-500/5', iconBg: 'bg-tesseract-500/10', iconBorder: 'border-tesseract-500/30', iconText: 'text-tesseract-300', hoverIconBg: 'hover:bg-tesseract-500', shadowColor: 'hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]', iconShadow: 'shadow-[0_0_10px_rgba(6,182,212,0.2)]' },
            { icon: ShieldCheck, title: 'Seguridad UI', desc: 'Implementación de diseños blindados y responsivos, a prueba de fallos en cualquier dispositivo de campo.', borderColor: 'border-blue-500/20', hoverBorder: 'hover:border-blue-500', bgCorner: 'bg-blue-500/5', iconBg: 'bg-blue-500/10', iconBorder: 'border-blue-500/30', iconText: 'text-blue-400', hoverIconBg: 'hover:bg-blue-500', shadowColor: 'hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]', iconShadow: 'shadow-[0_0_10px_rgba(59,130,246,0.2)]' },
            { icon: Cpu, title: 'Optimización', desc: 'Calibración de rendimiento y gestión de estado para asegurar una respuesta táctica en milisegundos.', borderColor: 'border-tesseract-700/20', hoverBorder: 'hover:border-tesseract-700', bgCorner: 'bg-tesseract-700/5', iconBg: 'bg-tesseract-700/10', iconBorder: 'border-tesseract-700/30', iconText: 'text-tesseract-300', hoverIconBg: 'hover:bg-tesseract-700', shadowColor: 'hover:shadow-[0_0_20px_rgba(8,145,178,0.15)]', iconShadow: 'shadow-[0_0_10px_rgba(8,145,178,0.2)]' }
          ].map((item, i) => (
            <motion.div 
              key={item.title} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className={`group relative overflow-hidden border ${item.borderColor} bg-dark/80 p-8 transition-all ${item.hoverBorder} ${item.shadowColor}`}
            >
              <div className={`absolute right-0 top-0 h-16 w-16 rounded-bl-full ${item.bgCorner}`}></div>
              <div className={`mb-6 flex h-12 w-12 items-center justify-center border ${item.iconBorder} ${item.iconBg} ${item.iconText} ${item.iconShadow} transition-all group-hover:scale-110 ${item.hoverIconBg} group-hover:text-white`}>
                <item.icon size={24} />
              </div>
              <h3 className="mb-3 text-xl font-bold uppercase tracking-wider text-white">{item.title}</h3>
              <p className="text-sm text-slate-400">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
