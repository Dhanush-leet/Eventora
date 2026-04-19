import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function HeroSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], [0, 220]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 130]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <div ref={containerRef} className="relative h-screen w-full overflow-hidden bg-[#0f0e0d]">
      {/* Parallax background image */}
      <motion.div
        className="absolute inset-0 w-full h-[120%] top-[-10%]"
        style={{ y: bgY }}
      >
        <img
          src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1920&h=1200&fit=crop&auto=format"
          alt="Eventora Hero"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-[#0f0e0d]" />
      </motion.div>

      {/* Hero content */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
        style={{ y: textY, opacity }}
      >
        <motion.span
          className="text-white/60 text-xs font-black tracking-[0.5em] uppercase mb-8 block"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          Premium Event Discovery
        </motion.span>

        <motion.h1
          className="text-white font-black italic tracking-tighter leading-none uppercase mb-6"
          style={{ fontSize: 'clamp(4rem, 12vw, 10rem)' }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          EVENTORA
        </motion.h1>

        <motion.p
          className="text-white/70 text-lg md:text-2xl font-medium max-w-xl leading-relaxed mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.25, ease: 'easeOut' }}
        >
          Staged for Excellence. Curated for Discovery.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-5"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.45, ease: 'easeOut' }}
        >
          <a
            href="/events"
            className="px-10 py-4 bg-white text-black text-xs font-black tracking-[0.35em] uppercase rounded-sm hover:bg-[#E31B23] hover:text-white transition-all duration-500 shadow-xl"
          >
            Browse Events
          </a>
          <a
            href="/movies"
            className="px-10 py-4 border border-white/30 text-white text-xs font-black tracking-[0.35em] uppercase rounded-sm hover:bg-white/10 transition-all duration-500"
          >
            Explore Movies
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <span className="text-[9px] font-black tracking-[0.5em] uppercase">Scroll</span>
        <motion.svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </motion.svg>
      </motion.div>
    </div>
  );
}
