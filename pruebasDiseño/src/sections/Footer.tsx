import { scrollToSection } from '../utils/scroll';

export const Footer = ({ onOpenPolicy, onOpenTerms }: { onOpenPolicy: () => void, onOpenTerms: () => void }) => (
  <footer className="bg-[#060505] text-rustic-400 py-32 px-6 md:px-16 border-t border-white/5 relative overflow-hidden z-30">
    <div className="max-w-7xl mx-auto relative z-10">
      <div className="grid md:grid-cols-4 gap-20 mb-32">
        <div className="md:col-span-2 space-y-8">
          <div className="text-5xl font-serif text-rustic-100 flex items-center gap-4 tracking-widest font-bold">
            ROBLE <span className="text-accent-gold italic font-light opacity-50">&</span> <br /> PIEDRA
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-rustic-400">
            Definiendo el nuevo lujo orgánico a través de la preservación de técnicas milenarias de ebanistería y labrado de piedra.
          </p>
        </div>
        
        <div className="space-y-8">
          <div className="text-rustic-200 text-[10px] uppercase tracking-[0.4em] font-black">Navegación</div>
          <ul className="space-y-4 text-sm font-medium">
            <li><a href="#galeria" onClick={(e) => scrollToSection(e, 'galeria')} className="hover:text-accent-gold transition-colors">Colección 2026</a></li>
            <li><a href="#historia" onClick={(e) => scrollToSection(e, 'historia')} className="hover:text-accent-gold transition-colors">Nuestro Atelier</a></li>
            <li><a href="#contacto" onClick={(e) => scrollToSection(e, 'contacto')} className="hover:text-accent-gold transition-colors">Journal Privado</a></li>
          </ul>
        </div>
        
        <div className="space-y-8">
          <div className="text-rustic-200 text-[10px] uppercase tracking-[0.4em] font-black">Legal</div>
          <ul className="space-y-4 text-sm font-medium">
            <li><button onClick={onOpenPolicy} className="hover:text-accent-gold transition-colors bg-transparent border-none p-0 cursor-pointer text-left">Privacidad Estricta</button></li>
            <li><button onClick={onOpenTerms} className="hover:text-accent-gold transition-colors bg-transparent border-none p-0 cursor-pointer text-left">Términos de Comisión</button></li>
          </ul>
        </div>
      </div>
      
      {/* Giant Typography Backdrop watermark */}
      <div className="absolute -bottom-2 right-0 text-[10rem] md:text-[18rem] font-serif text-white/[0.02] italic select-none pointer-events-none whitespace-nowrap leading-none">
        ROBLE & PIEDRA
      </div>

      <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between gap-8 text-[10px] uppercase tracking-[0.5em] text-rustic-500 font-bold">
        <span>EST. 2026</span>
      </div>
    </div>
  </footer>
);
