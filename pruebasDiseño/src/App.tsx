import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';

// Modular Sections
import { Navbar } from './sections/Navbar';
import { Hero } from './sections/Hero';
import { About } from './sections/About';
import { Gallery, items } from './sections/Gallery';
import { Contact } from './sections/Contact';
import { Footer } from './sections/Footer';

function App() {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Stateful interactions modals
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  
  // Success toast state with dynamic name and encrypted collector seal (Proposal A)
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successCollectorName, setSuccessCollectorName] = useState("");
  const [collectorSeal, setCollectorSeal] = useState("");

  // Keyboard Navigation for the Lightbox (Escape to close, Arrows to paginate)
  useEffect(() => {
    if (!selectedItem) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const currentIndex = items.findIndex(item => item.title === selectedItem.title);
      if (e.key === 'Escape') {
        setSelectedItem(null);
      } else if (e.key === 'ArrowRight' && currentIndex !== -1) {
        const nextIndex = (currentIndex + 1) % items.length;
        setSelectedItem(items[nextIndex]);
        setActiveIndex(nextIndex);
      } else if (e.key === 'ArrowLeft' && currentIndex !== -1) {
        const prevIndex = (currentIndex - 1 + items.length) % items.length;
        setSelectedItem(items[prevIndex]);
        setActiveIndex(prevIndex);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedItem]);

  // Initialize Lenis Smooth Scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    (window as any).lenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }, []);

  // Encrypted Collector Seal Generator function (Proposal A)
  const generateCollectorSeal = (name: string) => {
    const cleanName = name.trim();
    const initials = cleanName ? cleanName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : "RP";
    const year = new Date().getFullYear();
    const randomHex = Math.random().toString(16).substring(2, 6).toUpperCase();
    return `SEAL / ${initials}-${year}-${randomHex}`;
  };

  const handleFormSubmitSuccess = (name: string) => {
    setSuccessCollectorName(name);
    setCollectorSeal(generateCollectorSeal(name));
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
    }, 6000);
  };

  return (
    <div className="min-h-screen bg-rustic-50 selection:bg-accent-gold selection:text-rustic-900 relative">
      <div className="grain-overlay" />
      <Navbar onOpenReservation={() => setShowReservationModal(true)} />
      
      <main>
        <Hero />
        <About />
        <Gallery 
          activeIndex={activeIndex} 
          setActiveIndex={setActiveIndex} 
          onSelectItem={(item) => setSelectedItem(item)} 
          isModalOpen={selectedItem !== null} 
        />
        <Contact onSubmitSuccess={handleFormSubmitSuccess} />
      </main>
      
      <Footer 
        onOpenPolicy={() => setShowPolicyModal(true)} 
        onOpenTerms={() => setShowTermsModal(true)} 
      />

      {/* SUCCESS TOAST ALERTS - Proposal A */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-12 right-12 z-[250] bg-rustic-950 border border-accent-gold/40 p-8 md:p-12 max-w-md shadow-[0_50px_100px_rgba(0,0,0,0.8)] backdrop-blur-md rounded-sm text-left"
          >
            <span className="text-accent-gold uppercase tracking-[0.4em] text-[9px] font-black block mb-2">REGISTRO CONFIRMADO</span>
            <p className="text-rustic-100 font-serif italic text-lg leading-relaxed mb-4">
              "Bienvenido al Atelier de Roble & Piedra, {successCollectorName}."
            </p>
            
            {/* Dynamic Animated Collector Seal */}
            <div className="bg-rustic-900 border border-white/5 py-3 px-4 rounded-sm mb-4 flex items-center justify-between">
              <span className="text-[9px] uppercase tracking-[0.3em] text-rustic-400 font-bold">SELLO DE ADMISIÓN</span>
              <motion.span 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-accent-gold font-serif text-sm tracking-[0.15em] font-bold"
              >
                {collectorSeal}
              </motion.span>
            </div>

            <p className="text-rustic-400 text-xs leading-relaxed font-body">
              Su solicitud ha sido firmada digitalmente con su Sello exclusivo. Un maestro artesano de nuestro Atelier evaluará su proyecto y se pondrá en contacto con usted por canal privado en 24 horas.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PRIVATE RESERVATION MODAL */}
      <AnimatePresence>
        {showReservationModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowReservationModal(false)}
            className="fixed inset-0 z-[200] bg-rustic-950/98 backdrop-blur-xl flex items-center justify-center p-6 text-white"
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              className="bg-rustic-900 border border-white/10 p-12 max-w-2xl w-full shadow-[0_50px_100px_rgba(0,0,0,0.8)] rounded-sm relative text-left space-y-8"
            >
              <div className="space-y-2">
                <span className="text-accent-gold uppercase tracking-[0.4em] text-[9px] font-black block">RESERVA PRIVADA</span>
                <h4 className="text-4xl font-serif italic">Agenda una Cita en el Atelier</h4>
              </div>
              <div className="w-16 h-[1px] bg-accent-gold/40" />
              <p className="text-rustic-300 font-serif italic text-lg leading-relaxed">
                Nuestras citas exclusivas se coordinan para que el Atelier trabaje únicamente en su comitiva privada durante todo el día de su visita.
              </p>
              <p className="text-rustic-400 text-sm leading-relaxed">
                Por favor, utilice el formulario de contacto en el pie de página para detallar su proyecto de coleccionista. De forma alternativa, puede programar una llamada de admisión enviándonos un email cifrado a <span className="text-accent-gold font-serif">atelier@robleypiedra.com</span>.
              </p>
              <div className="flex justify-between items-center pt-4">
                <button 
                  onClick={() => setShowReservationModal(false)}
                  className="text-accent-gold uppercase tracking-[0.3em] text-[10px] font-black border-b border-accent-gold/30 pb-2 hover:border-accent-gold transition-colors cursor-pointer"
                >
                  Volver al Atelier
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STRICT PRIVACY STATEMENT MODAL */}
      <AnimatePresence>
        {showPolicyModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPolicyModal(false)}
            className="fixed inset-0 z-[200] bg-rustic-950/98 backdrop-blur-xl flex items-center justify-center p-6 text-white"
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              className="bg-rustic-900 border border-white/10 p-12 max-w-2xl w-full shadow-[0_50px_100px_rgba(0,0,0,0.8)] rounded-sm relative text-left space-y-8"
            >
              <div className="space-y-2">
                <span className="text-accent-gold uppercase tracking-[0.4em] text-[9px] font-black block">CÓDIGO DE HONOR</span>
                <h4 className="text-4xl font-serif italic">Privacidad Estricta</h4>
              </div>
              <div className="w-16 h-[1px] bg-accent-gold/40" />
              <p className="text-rustic-300 font-serif italic text-lg leading-relaxed">
                "El verdadero lujo de una pieza orgánica radica en su historia, reservada únicamente para los ojos de su portador."
              </p>
              <p className="text-rustic-400 text-sm leading-relaxed">
                Todos los datos personales, ubicaciones geográficas de destino para las piezas comisionadas y correspondencias de diseño se encriptan con protocolos de grado militar y se destruyen en nuestros servidores locales una vez finalizada la entrega, garantizando el anonimato absoluto de cada coleccionista de Roble & Piedra.
              </p>
              <div className="flex justify-between items-center pt-4">
                <button 
                  onClick={() => setShowPolicyModal(false)}
                  className="text-accent-gold uppercase tracking-[0.3em] text-[10px] font-black border-b border-accent-gold/30 pb-2 hover:border-accent-gold transition-colors cursor-pointer"
                >
                  Entendido
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* COMMISSION TERMS MODAL */}
      <AnimatePresence>
        {showTermsModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowTermsModal(false)}
            className="fixed inset-0 z-[200] bg-rustic-950/98 backdrop-blur-xl flex items-center justify-center p-6 text-white"
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              className="bg-rustic-900 border border-white/10 p-12 max-w-2xl w-full shadow-[0_50px_100px_rgba(0,0,0,0.8)] rounded-sm relative text-left space-y-8"
            >
              <div className="space-y-2">
                <span className="text-accent-gold uppercase tracking-[0.4em] text-[9px] font-black block">CONTRATO DE ARTESANÍA</span>
                <h4 className="text-4xl font-serif italic">Términos de Comisión</h4>
              </div>
              <div className="w-16 h-[1px] bg-accent-gold/40" />
              <p className="text-rustic-300 font-serif italic text-lg leading-relaxed">
                "La madera se expande, la piedra resiste. Diseñamos legados para durar generaciones."
              </p>
              <p className="text-rustic-400 text-sm leading-relaxed">
                El Atelier realiza un máximo de 10 obras monumentales por año natural. El proceso de comisión requiere de un depósito inicial del 30% del presupuesto acordado para la adquisición selectiva de maderas nobles en reservas nacionales y bloques de piedra de canteras certificadas. Las entregas se coordinan de forma personalizada con transporte blindado a nivel global.
              </p>
              <div className="flex justify-between items-center pt-4">
                <button 
                  onClick={() => setShowTermsModal(false)}
                  className="text-accent-gold uppercase tracking-[0.3em] text-[10px] font-black border-b border-accent-gold/30 pb-2 hover:border-accent-gold transition-colors cursor-pointer"
                >
                  Entendido
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Root Exhibition Lightbox Modal (Guarantees position:fixed is relative to viewport, NOT perspective containers) */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => setSelectedItem(null)}
            className="fixed inset-0 z-[200] bg-rustic-950/98 backdrop-blur-xl flex items-center justify-center p-6 md:p-16 text-white overflow-y-auto"
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              className="max-w-6xl w-full grid md:grid-cols-2 gap-20 items-center relative z-10 my-auto p-4"
            >
              {/* Image with elegant entry */}
              <motion.div 
                key={selectedItem.title + "_img"}
                initial={{ scale: 0.92, y: 40, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.92, y: 40, opacity: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative aspect-video w-full overflow-hidden border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.8)]"
              >
                <img src={selectedItem.img} alt={selectedItem.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </motion.div>

              {/* Poetic description & technical specs */}
              <motion.div 
                key={selectedItem.title + "_desc"}
                initial={{ x: 60, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 60, opacity: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-8 text-left"
              >
                <div>
                  <span className="text-accent-gold uppercase tracking-[0.5em] text-[10px] font-black block mb-2">CATÁLOGO EXCLUSIVO</span>
                  <h4 className="text-5xl md:text-7xl font-serif italic text-white tracking-tight leading-none">{selectedItem.title}</h4>
                </div>

                <div className="w-16 h-[1px] bg-accent-gold/40" />

                <p className="text-rustic-200 text-lg md:text-xl font-serif italic leading-relaxed">
                  "{selectedItem.desc}"
                </p>

                <div className="pt-8 border-t border-white/5 space-y-4">
                  <span className="text-[10px] uppercase tracking-widest text-accent-gold font-bold block">Ficha Técnica</span>
                  <p className="text-rustic-400 text-sm font-medium leading-relaxed">{selectedItem.specs}</p>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedItem(null)}
                    className="text-accent-gold uppercase tracking-[0.4em] text-[11px] font-black border-b border-accent-gold/30 pb-2 hover:border-accent-gold transition-colors inline-block cursor-pointer"
                  >
                    Cerrar Exhibición
                  </motion.button>
                  <span className="text-rustic-500 text-[10px] tracking-[0.3em] font-medium uppercase hidden sm:inline-block">← Teclado →</span>
                </div>
              </motion.div>
            </div>

            {/* Close Button top corner */}
            <button 
              onClick={() => setSelectedItem(null)}
              className="absolute top-10 right-10 text-white hover:text-accent-gold transition-colors p-4 z-20"
            >
              <div className="w-8 h-[1px] bg-current rotate-45 relative translate-y-[1px]" />
              <div className="w-8 h-[1px] bg-current -rotate-45 relative -translate-y-[1px]" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
