import { motion, useScroll, useTransform } from 'framer-motion';
import heroImg from '../assets/hero.png';
import { DustMotes } from '../components/DustMotes';
import { OrganicLeaves } from '../components/OrganicLeaves';
import { WordReveal } from '../components/WordReveal';
import { scrollToSection } from '../utils/scroll';

export const Hero = () => {
  const { scrollY } = useScroll();
  const yImage = useTransform(scrollY, [0, 1000], ['0%', '25%']);
  const opacityText = useTransform(scrollY, [0, 500], [1, 0]);
  const scaleImage = useTransform(scrollY, [0, 1000], [1.1, 1]);

  return (
    <section id="inicio" className="relative h-screen flex items-center justify-center overflow-hidden bg-rustic-950">
      {/* Background Parallax Image */}
      <motion.div style={{ y: yImage, scale: scaleImage }} className="absolute inset-0">
        <img src={heroImg} alt="Rustic Cabin Monolith" loading="eager" fetchPriority="high" className="w-full h-full object-cover opacity-75" />
        <div className="absolute inset-0 bg-gradient-to-b from-rustic-950/20 via-rustic-950/50 to-rustic-950" />
      </motion.div>
      
      {/* Museum Frame Outline */}
      <div className="absolute inset-6 border border-white/5 pointer-events-none z-20" />
      
      {/* Top Left Atelier Info */}
      <div className="absolute top-32 left-12 hidden lg:block z-20 text-left">
        <span className="text-[9px] uppercase tracking-[0.5em] text-rustic-400 block mb-1">ATELIER AUTORIZADO</span>
        <span className="text-xs font-serif text-rustic-200 italic">Estudio de Alta Ebanistería</span>
      </div>

      {/* Top Right Coordinates Info */}
      <div className="absolute top-32 right-12 hidden lg:block z-20 text-right">
        <span className="text-[9px] uppercase tracking-[0.5em] text-rustic-400 block mb-1">LOCALIZACIÓN</span>
        <span className="text-xs font-serif text-rustic-200 italic">40.4168° N, 3.7038° W</span>
      </div>

      <motion.div style={{ opacity: opacityText }} className="relative z-10 text-center px-6 max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 flex items-center justify-center gap-6"
        >
          <div className="w-16 h-[1px] bg-accent-gold/40" />
          <span className="text-accent-gold uppercase tracking-[0.7em] text-[10px] font-black">PRESENCIA ORGÁNICA</span>
          <div className="w-16 h-[1px] bg-accent-gold/40" />
        </motion.div>
        
        <h1 className="text-6xl md:text-[11rem] text-rustic-50 mb-16 leading-[0.8] tracking-tighter font-serif select-none">
          <span className="block mb-2"><WordReveal text="Naturaleza" /></span>
          <span className="block italic font-light text-rustic-300 opacity-90"><WordReveal text="Inmortal" /></span>
        </h1>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="flex flex-col sm:flex-row gap-8 justify-center items-center"
        >
          <motion.a 
            href="#galeria" 
            onClick={(e) => scrollToSection(e, 'galeria')}
            whileHover={{ y: -4, boxShadow: '0 25px 50px -12px rgba(181, 169, 159, 0.25)' }}
            whileTap={{ scale: 0.98 }}
            className="bg-accent-gold text-rustic-950 px-20 py-8 rounded-sm font-serif italic text-xl shadow-xl transition-all duration-700 border border-accent-gold/30 flex items-center gap-8 group cursor-pointer"
          >
            Explorar Colección
            <span className="w-10 h-[1px] bg-rustic-950/40 group-hover:w-16 transition-all duration-500" />
          </motion.a>
        </motion.div>
      </motion.div>
      
      <DustMotes />
      <OrganicLeaves />
      
      {/* Subtle Bottom Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4">
        <span className="text-[8px] uppercase tracking-[0.6em] text-rustic-400">DESCUBRIR</span>
        <motion.div 
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-[1px] h-12 bg-gradient-to-b from-accent-gold to-transparent"
        />
      </div>
    </section>
  );
};
