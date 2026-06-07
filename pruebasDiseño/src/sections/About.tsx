import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import workshopImg from '../assets/workshop.png';
import { SectionHeading } from '../components/SectionHeading';
import { scrollToSection } from '../utils/scroll';

export const About = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Smooth background color shift from Bone/Paper (#F7F3F0) to an organic Warm Clay/Linen Clay (#EDE4DC) and back
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ["#F7F3F0", "#EDE4DC", "#F7F3F0"]
  );

  return (
    <motion.section 
      id="historia" 
      ref={containerRef}
      style={{ backgroundColor }}
      className="py-60 px-6 md:px-12 relative overflow-hidden transition-colors duration-1000"
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
        <div className="lg:w-1/2 relative z-10">
          <SectionHeading subtitle="Nuestra Esencia" title="Madera con Memoria" />
          <div className="space-y-12 max-w-lg">
            <p className="text-rustic-600 text-2xl md:text-3xl font-serif italic leading-snug">
              "Cada grieta en el roble es un susurro de los siglos que han pasado."
            </p>
            <div className="w-20 h-[1px] bg-accent-gold" />
            <p className="text-rustic-500 text-lg leading-relaxed font-body">
              No forzamos la materia. La escuchamos. En nuestro atelier, el tiempo se detiene para permitir que la madera respire y encuentre su forma definitiva. Un proceso que no entiende de prisas, solo de perfección.
            </p>
            <motion.a 
              href="#contacto"
              onClick={(e) => scrollToSection(e, 'contacto')}
              whileHover={{ x: 10 }}
              className="inline-flex items-center gap-6 text-accent-gold uppercase tracking-[0.4em] text-[10px] font-bold cursor-pointer"
            >
              NUESTRO LEGADO <span className="w-16 h-[1px] bg-accent-gold/40" />
            </motion.a>
          </div>
        </div>
        
        <div className="lg:w-1/2 relative">
          <motion.div 
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
            className="relative aspect-[4/5] w-full max-w-md ml-auto"
          >
            <div className="absolute -inset-10 border border-rustic-200 pointer-events-none" />
            <img 
              src={workshopImg} 
              loading="lazy"
              className="w-full h-full object-cover grayscale-[0.3] hover:grayscale-0 transition-all duration-1000 shadow-2xl" 
            />
            <div className="absolute -bottom-10 -left-10 bg-rustic-950 p-12 hidden md:block">
              <div className="text-accent-gold text-5xl font-serif mb-2 italic">120+</div>
              <div className="text-rustic-300 text-[10px] uppercase tracking-widest font-bold">Años de Tradición</div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};
