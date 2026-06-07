import { motion } from 'framer-motion';

export const OrganicLeaves = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-25 z-10">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: Math.random() * 120 + '%', 
            y: '-10%',
            rotate: Math.random() * 360,
            scale: Math.random() * 0.4 + 0.4
          }}
          animate={{ 
            y: ['-10%', '110%'],
            x: [null, (Math.random() - 0.7) * 40 + '%'],
            rotate: [null, Math.random() * 720 - 360]
          }}
          transition={{ 
            duration: Math.random() * 18 + 18, 
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 8
          }}
          className="absolute w-4 h-6 bg-gradient-to-tr from-accent-gold/30 to-accent-gold/5 rounded-full"
          style={{
            clipPath: 'polygon(50% 0%, 100% 35%, 80% 100%, 20% 100%, 0% 35%)',
            filter: 'blur(1px)'
          }}
        />
      ))}
    </div>
  );
};
