import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const ElegantHero = ({ title, subtitle, bgImage }) => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <div className="relative h-[70vh] w-full overflow-hidden flex items-center justify-center">
      <motion.div 
        style={{ y: y1 }}
        className="absolute inset-0 z-0"
      >
        <img 
          src={bgImage} 
          alt="Hero Background" 
          className="w-full h-full object-cover scale-110"
        />
        <div className="absolute inset-0 bg-[#0B0F1A]/60 backdrop-blur-[2px]" />
        <div className="absolute inset-0 cinematic-gradient" />
      </motion.div>

      <motion.div 
        style={{ opacity }}
        className="relative z-10 text-center px-6"
      >
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-[#E31B23] text-xs font-black tracking-[0.5em] uppercase mb-6 block"
        >
          {subtitle}
        </motion.span>
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-elegant text-6xl md:text-9xl font-black italic tracking-tighter uppercase leading-none mb-8"
        >
          {title.split(' ').map((word, i) => (
            <span key={i} className={i % 2 !== 0 ? 'text-[#E31B23]' : 'text-white'}>
              {word}{' '}
            </span>
          ))}
        </motion.h1>
      </motion.div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#0B0F1A] to-transparent z-20" />
    </div>
  );
};

export default ElegantHero;
