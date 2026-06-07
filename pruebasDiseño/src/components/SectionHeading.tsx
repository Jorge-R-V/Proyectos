import { motion } from 'framer-motion';
import { WordReveal } from './WordReveal';

export const SectionHeading = ({ subtitle, title, light = false }: { subtitle: string, title: string, light?: boolean }) => (
  <div className="mb-20">
    <motion.span 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className="text-accent-gold uppercase tracking-[0.5em] text-[10px] font-black mb-4 block"
    >
      {subtitle}
    </motion.span>
    <h2 className={`text-5xl md:text-8xl leading-[0.95] tracking-tighter ${light ? 'text-rustic-50 font-serif' : 'text-rustic-900 font-serif'}`}>
      <WordReveal text={title} />
    </h2>
  </div>
);
