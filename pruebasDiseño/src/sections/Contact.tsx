import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { SectionHeading } from '../components/SectionHeading';

export const Contact = ({ onSubmitSuccess }: { onSubmitSuccess: (name: string) => void }) => {
  const [formFocused, setFormFocused] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const visionRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const enteredName = nameRef.current?.value || "Coleccionista";

    setTimeout(() => {
      setIsSubmitting(false);
      onSubmitSuccess(enteredName);
      if (nameRef.current) nameRef.current.value = "";
      if (emailRef.current) emailRef.current.value = "";
      if (visionRef.current) visionRef.current.value = "";
    }, 1800);
  };

  return (
    <section id="contacto" className="py-60 px-6 md:px-16 bg-[#0c0b0a] relative overflow-hidden text-white border-t border-white/5 z-30">
      {/* Background Decorative Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-gold/5 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-32 relative z-10">
        <div className="flex flex-col justify-between">
          <div>
            <SectionHeading subtitle="SOLICITUD DE ADMISIÓN" title="Hablemos de Arte" light />
            <p className="text-rustic-300 text-xl max-w-xl leading-relaxed mb-16 font-serif italic">
              Cada pieza premium de Roble & Piedra es única y comisionada bajo reserva estricta. Visita el taller privado para diseñar tu legado con nuestros artesanos maestros.
            </p>
          </div>
          
          <div className="space-y-12">
            <div className="flex items-start gap-6">
              <span className="text-accent-gold text-xs font-black tracking-widest uppercase mt-1">I / EL ATELIER</span>
              <div>
                <p className="text-rustic-100 text-xl font-serif">Av. del Bosque 45</p>
                <p className="text-rustic-400 text-sm">Madrid, España</p>
              </div>
            </div>
            
            <div className="flex items-start gap-6">
              <span className="text-accent-gold text-xs font-black tracking-widest uppercase mt-1">II / CANAL</span>
              <div>
                <p className="text-rustic-100 text-xl font-serif">+34 912 345 678</p>
                <p className="text-rustic-400 text-sm">contacto@robleypiedra.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Private Collector Registry Form Monolith */}
        <div className="bg-rustic-950/40 border border-white/10 p-12 md:p-20 shadow-[0_50px_100px_rgba(0,0,0,0.8)] backdrop-blur-md relative rounded-sm">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-accent-gold/40 to-transparent" />
          
          <h4 className="text-lg uppercase tracking-[0.4em] text-accent-gold font-bold mb-12 text-center">REGISTRO PRIVADO</h4>
          
          <form onSubmit={handleSubmit} className="space-y-12">
            <div className="relative">
              <label className={`text-[9px] uppercase tracking-widest font-black transition-all duration-300 ${formFocused === 'name' ? 'text-accent-gold' : 'text-rustic-400'}`}>Identidad Completa</label>
              <input 
                type="text" 
                ref={nameRef}
                required
                onFocus={() => setFormFocused('name')}
                onBlur={() => setFormFocused(null)}
                className="w-full bg-transparent border-b border-white/10 focus:border-accent-gold py-4 focus:outline-none transition-colors text-xl font-serif" 
                placeholder="Su Nombre" 
              />
            </div>
            
            <div className="relative">
              <label className={`text-[9px] uppercase tracking-widest font-black transition-all duration-300 ${formFocused === 'email' ? 'text-accent-gold' : 'text-rustic-400'}`}>Canal Privado</label>
              <input 
                type="email" 
                ref={emailRef}
                required
                onFocus={() => setFormFocused('email')}
                onBlur={() => setFormFocused(null)}
                className="w-full bg-transparent border-b border-white/10 focus:border-accent-gold py-4 focus:outline-none transition-colors text-xl font-serif" 
                placeholder="su@email.com" 
              />
            </div>
            
            <div className="relative">
              <label className={`text-[9px] uppercase tracking-widest font-black transition-all duration-300 ${formFocused === 'vision' ? 'text-accent-gold' : 'text-rustic-400'}`}>Visión o Proyecto</label>
              <textarea 
                rows={3} 
                ref={visionRef}
                required
                onFocus={() => setFormFocused('vision')}
                onBlur={() => setFormFocused(null)}
                className="w-full bg-transparent border-b border-white/10 focus:border-accent-gold py-4 focus:outline-none transition-colors text-xl font-serif resize-none" 
                placeholder="Cuéntanos tu proyecto..."
              />
            </div>

            <motion.button 
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: isSubmitting ? 1 : 1.02, backgroundColor: isSubmitting ? '#a89482' : '#c5b09d' }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              className="w-full bg-accent-gold text-rustic-950 py-6 font-serif italic text-2xl shadow-2xl transition-all duration-500 rounded-sm font-bold block cursor-pointer disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-4">
                  <div className="w-6 h-6 border-2 border-rustic-950 border-t-transparent rounded-full animate-spin" />
                  <span>Procesando...</span>
                </div>
              ) : "Iniciar Conversación"}
            </motion.button>
          </form>
        </div>
      </div>
    </section>
  );
};
