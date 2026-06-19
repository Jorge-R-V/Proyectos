import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { scrollToSection } from '../utils/scroll';

export const Navbar = ({ onOpenReservation }: { onOpenReservation: () => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'inicio', id: 'inicio' },
    { name: 'historia', id: 'historia' },
    { name: 'galeria', id: 'galeria' },
    { name: 'contacto', id: 'contacto' }
  ];

  return (
    <>
      <motion.div 
        className="fixed top-0 left-0 right-0 h-[2px] bg-accent-gold z-[100] origin-left"
        style={{ scaleX }}
      />
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 w-full z-[60] px-6 md:px-16 flex justify-between items-center transition-all duration-700 ${
          isScrolled || isOpen ? 'py-5 bg-rustic-950/95 backdrop-blur-md shadow-2xl border-b border-white/5' : 'py-12 bg-transparent'
        }`}
      >
        <div className="text-xl md:text-2xl font-serif font-black text-rustic-50 tracking-[0.15em] flex items-center gap-3">
          ROBLE <span className="text-accent-gold italic font-light opacity-60 text-3xl">&</span> PIEDRA
        </div>
        
        <div className="hidden md:flex gap-16 text-[10px] uppercase tracking-[0.5em] font-bold text-rustic-200">
          {navLinks.map((item) => (
            <a 
              key={item.name} 
              href={`#${item.id}`} 
              onClick={(e) => scrollToSection(e, item.id)}
              className="hover:text-accent-gold transition-colors relative group"
            >
              {item.name}
              <motion.span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-accent-gold transition-all duration-500 group-hover:w-full" />
            </a>
          ))}
        </div>

        <div className="flex items-center gap-8">
          <motion.button 
            onClick={onOpenReservation}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="hidden md:block bg-transparent text-rustic-100 px-6 py-3 border border-accent-gold/20 hover:border-accent-gold hover:text-accent-gold text-[10px] uppercase tracking-[0.4em] font-black rounded-sm transition-all duration-500 cursor-pointer"
          >
            Reserva una Cita
          </motion.button>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-rustic-50 p-2">
            <div className="w-6 h-5 relative flex flex-col justify-between">
              <motion.span animate={isOpen ? { rotate: 45, y: 9 } : { rotate: 0, y: 0 }} className="w-full h-[1px] bg-current block origin-center transition-transform" />
              <motion.span animate={isOpen ? { opacity: 0 } : { opacity: 1 }} className="w-full h-[1px] bg-current block" />
              <motion.span animate={isOpen ? { rotate: -45, y: -10 } : { rotate: 0, y: 0 }} className="w-full h-[1px] bg-current block origin-center transition-transform" />
            </div>
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ clipPath: 'circle(0% at 100% 0%)' }}
            animate={{ clipPath: 'circle(150% at 100% 0%)' }}
            exit={{ clipPath: 'circle(0% at 100% 0%)' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[55] bg-rustic-950 flex flex-col items-center justify-center gap-12 md:hidden"
          >
            {navLinks.map((item, i) => (
              <motion.a 
                key={item.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                href={`#${item.id}`} 
                onClick={(e) => {
                  setIsOpen(false);
                  scrollToSection(e, item.id);
                }}
                className="text-5xl font-serif text-rustic-50 hover:text-accent-gold transition-colors"
              >
                {item.name}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
