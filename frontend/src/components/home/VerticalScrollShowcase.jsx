import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const PROJECTS = [
  {
    title: 'THE BRAND LIVE',
    category: 'Music · Concert',
    img: 'https://images.unsplash.com/photo-1493225255565-dc6c1fde2df8?w=1400&h=900&fit=crop&auto=format',
  },
  {
    title: 'GLOBAL DISCOVERY',
    category: 'Culture · Travel',
    img: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1400&h=900&fit=crop&auto=format',
  },
  {
    title: 'STAGE IMMERSIVE',
    category: 'Theatre · Arts',
    img: 'https://images.unsplash.com/photo-1504680602000-fd0a9da2dae8?w=1400&h=900&fit=crop&auto=format',
  },
  {
    title: 'NIGHT ELECTRA',
    category: 'Club · Electronic',
    img: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1400&h=900&fit=crop&auto=format',
  },
];

function ParallaxImageCard({ project, index }) {
  const cardRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  });

  const imgY = useTransform(scrollYProgress, [0, 1], [-60, 60]);
  const titleX = useTransform(scrollYProgress, [0, 0.5, 1], [-30, 0, 30]);
  const titleOpacity = useTransform(scrollYProgress, [0.1, 0.35, 0.65, 0.9], [0, 1, 1, 0]);

  return (
    <motion.div
      ref={cardRef}
      className="relative w-full overflow-hidden"
      style={{ height: '80vh' }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="absolute inset-0 w-full"
        style={{ y: imgY, height: '115%', top: '-7.5%' }}
      >
        <img
          src={project.img}
          alt={project.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
      </motion.div>

      <div className="absolute inset-0 flex items-end justify-start px-12 md:px-20 pb-16 pointer-events-none">
        <div>
          <motion.span
            className="text-white/50 text-[9px] font-black tracking-[0.6em] uppercase block mb-3"
            style={{ x: titleX, opacity: titleOpacity }}
          >
            {String(index + 1).padStart(2, '0')} · {project.category}
          </motion.span>
          <motion.h2
            className="text-white font-black italic tracking-tighter uppercase leading-none"
            style={{ x: titleX, opacity: titleOpacity, fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
          >
            {project.title}
          </motion.h2>
        </div>
      </div>
    </motion.div>
  );
}

export default function VerticalScrollShowcase({ title = 'FEATURED EXPERIENCES' }) {
  return (
    <section className="bg-[#0f0e0d]">
      <div className="max-w-7xl mx-auto px-8 py-24">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-[2px] bg-[#E31B23]" />
          <span className="text-[#E31B23] text-[9px] font-black tracking-[0.6em] uppercase">Scroll to Explore</span>
        </div>
        <motion.h2
          className="text-white text-5xl md:text-8xl font-black italic tracking-tighter uppercase leading-none"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          {title}
        </motion.h2>
      </div>

      <div className="flex flex-col gap-2">
        {PROJECTS.map((project, i) => (
          <ParallaxImageCard key={i} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}
