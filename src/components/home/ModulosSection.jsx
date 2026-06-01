import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { QrCode, Calculator, LayoutTemplate, ScanLine } from 'lucide-react';

export default function ModulosSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section id="modulos" className="relative py-20 border-t border-tesseract-500/10 bg-card/40">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-glow mb-4 text-3xl font-bold uppercase tracking-widest text-white md:text-4xl">Módulos Tácticos</h2>
          <div className="mx-auto h-1 w-24 bg-tesseract-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
          <p className="mt-4 text-lg font-light text-slate-400 max-w-2xl mx-auto">
            Herramientas especializadas integradas en el sistema para operaciones de campo.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <motion.div variants={itemVariants}>
            <Link to="/scanner" className="group block border border-slate-800 bg-dark p-6 transition-all hover:border-tesseract-500 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] rounded-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-tesseract-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <ScanLine className="text-tesseract-400 mb-4 transition-transform group-hover:scale-110" size={32} />
              <h3 className="text-lg font-bold text-white mb-2">Escáner</h3>
              <p className="text-sm text-slate-400">Decodificación y análisis de códigos QR en tiempo real.</p>
            </Link>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Link to="/qr" className="group block border border-slate-800 bg-dark p-6 transition-all hover:border-tesseract-500 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] rounded-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-tesseract-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <QrCode className="text-tesseract-400 mb-4 transition-transform group-hover:scale-110" size={32} />
              <h3 className="text-lg font-bold text-white mb-2">Generador QR</h3>
              <p className="text-sm text-slate-400">Creación de códigos QR ultra-personalizados y blindados.</p>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Link to="/math" className="group block border border-slate-800 bg-dark p-6 transition-all hover:border-tesseract-500 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] rounded-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-tesseract-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Calculator className="text-tesseract-400 mb-4 transition-transform group-hover:scale-110" size={32} />
              <h3 className="text-lg font-bold text-white mb-2">Math Pro</h3>
              <p className="text-sm text-slate-400">Resolución de polinomios paso a paso con rigor matemático.</p>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Link to="/tripticos" className="group block border border-slate-800 bg-dark p-6 transition-all hover:border-tesseract-500 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] rounded-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-tesseract-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <LayoutTemplate className="text-tesseract-400 mb-4 transition-transform group-hover:scale-110" size={32} />
              <h3 className="text-lg font-bold text-white mb-2">Trípticos IA</h3>
              <p className="text-sm text-slate-400">Generador de trípticos impulsado por DeepSeek V3.</p>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
