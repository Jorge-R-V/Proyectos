import { motion } from 'framer-motion';

export const DustMotes = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 z-10">
      {[...Array(25)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: Math.random() * 100 + '%', 
            y: Math.random() * 100 + '%',
            opacity: 0 
          }}
          animate={{ 
            y: [null, '-10%', '110%'],
            x: [null, (Math.random() - 0.5) * 15 + '%', (Math.random() - 0.5) * 15 + '%'],
            opacity: [0, 0.7, 0]
          }}
          transition={{ 
            duration: Math.random() * 12 + 12, 
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute w-1 h-1 bg-accent-gold/40 rounded-full blur-[1px]"
        />
      ))}
    </div>
  );
};
