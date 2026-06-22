import { useState, useEffect } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';
import heroImg from '../assets/hero.png';
import workshopImg from '../assets/workshop.png';
import potteryImg from '../assets/pottery.png';
import { SectionHeading } from '../components/SectionHeading';

// Centralized items array exported for app-wide coordination
export const items = [
  { title: 'Corte de Roble', img: heroImg, desc: 'Madera extraída de robles centenarios con vetas oscuras talladas a mano y tratadas con aceites orgánicos.', specs: 'Roble de 200 años, 240x120cm, Acabado natural' },
  { title: 'Vaso de Barro', img: potteryImg, desc: 'Cerámica cocida a temperaturas milenarias con barros selectos de las canteras más profundas de España.', specs: 'Arcilla roja, 45cm altura, Esmalte artesanal' },
  { title: 'Losa de Taller', img: workshopImg, desc: 'Piedra de cantera cincelada con pulso firme y devoción en el atelier, guardando la frialdad eterna de la roca.', specs: 'Granito labrado, 180x90cm, Canto natural' },
  { title: 'Veta Maestra', img: heroImg, desc: 'Un encuentro único de vetas asimétricas que recuerdan las llanuras boscosas de nuestra tierra.', specs: 'Roble ahumado, 200x100cm, Pulido a mano' },
  { title: 'Piedra Ancestral', img: potteryImg, desc: 'Pieza escultórica moldeada por la paciencia y el pulso del maestro cantero en honor a las raíces rústicas.', specs: 'Piedra sedimentaria, Escultura única' },
];

const GalleryCard = ({ item, index, offset, isActive, onSelect, onHoverChange }: { item: any, index: number, offset: number, isActive: boolean, onSelect: () => void, onHoverChange: (hovered: boolean) => void }) => {
  const [isCardHovered, setIsCardHovered] = useState(false);

  const variants = {
    active: {
      x: "0%",
      z: 0,
      rotateY: 0,
      rotateX: 0,
      scale: 1,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }
    },
    right: {
      x: "100%",
      z: -1200,
      rotateY: -45,
      rotateX: -5,
      scale: 0.8,
      opacity: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }
    },
    left: {
      x: "-100%",
      z: -1200,
      rotateY: 45,
      rotateX: 5,
      scale: 0.8,
      opacity: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }
    },
    hidden: {
      z: -2000,
      opacity: 0,
      transition: { duration: 0.8 }
    }
  };

  const getVariantName = () => {
    if (offset === 0) return "active";
    if (offset === 1) return "right";
    if (offset === -1) return "left";
    return "hidden";
  };

  // Gorgeous 3D Tilt calculations
  const xMouse = useMotionValue(0);
  const yMouse = useMotionValue(0);
  const mouseXSpring = useSpring(xMouse, { stiffness: 150, damping: 25 });
  const mouseYSpring = useSpring(yMouse, { stiffness: 150, damping: 25 });
  const rotateXMouse = useTransform(mouseYSpring, [-0.5, 0.5], [10, -10]);
  const rotateYMouse = useTransform(mouseXSpring, [-0.5, 0.5], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isActive) return;
    setIsCardHovered(true);
    onHoverChange(true);
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mX = e.clientX - rect.left - width / 2;
    const mY = e.clientY - rect.top - height / 2;
    xMouse.set(mX / width);
    yMouse.set(mY / height);
  };

  const handleMouseLeave = () => {
    setIsCardHovered(false);
    onHoverChange(false);
    xMouse.set(0);
    yMouse.set(0);
  };

  return (
    <motion.div 
      animate={getVariantName()}
      variants={variants}
      style={{ 
        position: 'absolute',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        top: 0,
        left: 0,
        transformStyle: 'preserve-3d',
        pointerEvents: isActive ? 'auto' : 'none',
        zIndex: isActive ? 150 : 10 - Math.abs(offset)
      }}
    >
      <div 
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        className="absolute w-[90vw] md:w-[70vw] aspect-video cursor-pointer z-50"
      />

      <motion.div 
        style={{ rotateX: rotateXMouse, rotateY: rotateYMouse }}
        className="relative w-[90vw] md:w-[70vw] aspect-video group pointer-events-none"
      >
        <div className="relative w-full h-full overflow-hidden shadow-[0_60px_100px_rgba(0,0,0,0.7)] border border-white/10 bg-rustic-950">
          <img 
            src={item.img} 
            alt={item.title} 
            className="w-full h-full object-cover grayscale-[0.4] group-hover:grayscale-0 sepia-[0.15] group-hover:sepia-0 contrast-[1.05] brightness-[0.85] group-hover:brightness-100 transition-all duration-1000 origin-center"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-rustic-950 via-transparent to-white/5 opacity-70" />
          
          <motion.div 
            initial={{ left: "-100%" }}
            animate={{ left: isCardHovered && isActive ? "100%" : "-100%" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute top-0 w-full h-full pointer-events-none z-20 bg-[linear-gradient(110deg,transparent_30%,rgba(197,176,157,0.15)_45%,rgba(197,176,157,0.3)_50%,rgba(197,176,157,0.15)_55%,transparent_70%)]"
          />

          <div className="absolute top-0 left-0 w-full h-full border-[1px] border-accent-gold/10 pointer-events-none m-4" />
          
          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-24">
            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="mb-6 flex items-center gap-4"
              >
                <div className="w-8 h-[1px] bg-accent-gold/40" />
                <span className="text-accent-gold text-[10px] uppercase tracking-[0.6em] font-bold">Obra Seleccionada</span>
              </motion.div>
              <h3 className="text-4xl md:text-9xl font-serif text-white italic tracking-tighter leading-[0.8] mb-8">
                {item.title}
              </h3>
              
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ 
                  opacity: isCardHovered && isActive ? 1 : 0, 
                  y: isCardHovered && isActive ? 0 : 15 
                }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-12"
              >
                <div className="w-24 h-[1px] bg-accent-gold/20" />
                <span className="text-rustic-400 text-[10px] uppercase tracking-widest font-medium">Click para Detalles</span>
              </motion.div>
            </div>
            
            <motion.div 
              animate={{ opacity: isCardHovered && isActive ? 0.25 : 0.08 }}
              className="absolute top-12 right-12 text-7xl font-serif text-accent-gold italic select-none"
            >
              {index + 1}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const Gallery = ({ activeIndex, setActiveIndex, onSelectItem, isModalOpen }: { activeIndex: number, setActiveIndex: (i: number) => void, onSelectItem: (item: any) => void, isModalOpen: boolean }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getWrappedOffset = (index: number, active: number, total: number) => {
    let diff = index - active;
    if (diff < -total / 2) diff += total;
    if (diff > total / 2) diff -= total;
    return diff;
  };

  useEffect(() => {
    if (isHovered || isModalOpen) return;

    const interval = setInterval(() => {
      setActiveIndex((activeIndex + 1) % items.length);
    }, 3800);

    return () => clearInterval(interval);
  }, [isHovered, isModalOpen, activeIndex]);

  return (
    <section 
      id="galeria" 
      className="relative h-screen bg-rustic-950 overflow-hidden flex items-center justify-center"
    >
      <div className="absolute inset-0 pointer-events-none z-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />

      <div className="w-full h-full overflow-hidden [perspective:2500px] flex items-center justify-center relative">
        <div className="absolute top-24 left-0 w-full text-center z-50 pointer-events-none px-6">
          <SectionHeading subtitle="El Atelier" title="Colección Orgánica" light />
        </div>
        
        <div className="relative w-full h-full max-w-7xl [transform-style:preserve-3d] flex items-center justify-center">
          {items.map((item, i) => (
            <GalleryCard 
              key={i} 
              item={item} 
              index={i} 
              offset={getWrappedOffset(i, activeIndex, items.length)}
              isActive={activeIndex === i}
              onSelect={() => onSelectItem(item)} 
              onHoverChange={(hovered) => {
                if (activeIndex === i) {
                  setIsHovered(hovered);
                }
              }}
            />
          ))}
        </div>
        
        {/* Minimalist Horizontal Progress Indicators */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-50 flex items-center gap-6 pointer-events-none">
          {items.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setActiveIndex(i)} 
              className="w-12 h-4 flex items-center relative group pointer-events-auto cursor-pointer"
            >
              <div className="w-full h-[2px] bg-white/10 relative overflow-hidden transition-all duration-300 group-hover:bg-white/30 rounded-full">
                {activeIndex === i && (
                  <motion.div 
                    initial={{ left: "-100%" }}
                    animate={{ left: isHovered ? "-100%" : "0%" }}
                    transition={{ 
                      duration: 3.8, 
                      ease: "linear"
                    }}
                    key={activeIndex + "_" + isHovered}
                    className="absolute top-0 left-0 w-full h-full bg-accent-gold"
                  />
                )}
              </div>
            </button>
          ))}
        </div>

        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-rustic-950 to-transparent z-40 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-rustic-950 to-transparent z-40 pointer-events-none" />
      </div>
    </section>
  );
};
