import React, { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const EVENT_IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1493749671281-43bbf1ea96a4?w=900&h=600&fit=crop&auto=format',
    title: 'Live Concerts',
    category: 'Music',
  },
  {
    src: 'https://images.unsplash.com/photo-1501657179228-8a41e7a17da0?w=900&h=600&fit=crop&auto=format',
    title: 'Film Festivals',
    category: 'Cinema',
  },
  {
    src: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=900&h=600&fit=crop&auto=format',
    title: 'Cultural Fests',
    category: 'Culture',
  },
  {
    src: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=900&h=600&fit=crop&auto=format',
    title: 'Night Shows',
    category: 'Entertainment',
  },
  {
    src: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=900&h=600&fit=crop&auto=format',
    title: 'Stage Performances',
    category: 'Theatre',
  },
];

function GalleryCard({ image, index }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="flex-shrink-0 relative overflow-hidden rounded-sm cursor-pointer"
      style={{ width: '360px', height: '480px' }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.02 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.img
        src={image.src}
        alt={image.title}
        className="w-full h-full object-cover"
        animate={{ scale: hovered ? 1.08 : 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        loading="lazy"
      />

      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
        animate={{ opacity: hovered ? 1 : 0.6 }}
        transition={{ duration: 0.4 }}
      />

      <motion.span
        className="absolute top-5 left-5 text-[9px] font-black tracking-[0.4em] uppercase bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-sm"
        initial={{ x: -20, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.06 + 0.3, duration: 0.5 }}
      >
        {image.category}
      </motion.span>

      <div className="absolute bottom-8 left-7 right-7">
        <motion.h3
          className="text-white text-3xl font-black italic tracking-tighter uppercase leading-tight"
          animate={{ y: hovered ? -4 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {image.title}
        </motion.h3>
        <motion.div
          className="h-[2px] bg-[#E31B23] mt-3"
          animate={{ width: hovered ? '100%' : '32px' }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
      </div>
    </motion.div>
  );
}

export default function HorizontalScrollGallery({ title = 'EXPLORE EVENTS' }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < maxScroll - 10);
    setScrollProgress(maxScroll > 0 ? el.scrollLeft / maxScroll : 0);
  }, []);

  const scrollBy = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 400, behavior: 'smooth' });
  };

  return (
    <section className="py-24 bg-[#0f0e0d] overflow-hidden">
      <div className="max-w-7xl mx-auto px-8 mb-14 flex items-end justify-between">
        <div>
          <div className="flex items-center gap-4 mb-5">
            <div className="w-10 h-[2px] bg-[#E31B23]" />
            <span className="text-[#E31B23] text-[9px] font-black tracking-[0.6em] uppercase">Curated Gallery</span>
          </div>
          <h2 className="text-white text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none">
            {title}
          </h2>
        </div>

        <div className="hidden md:flex gap-3">
          <button
            onClick={() => scrollBy(-1)}
            disabled={!canScrollLeft}
            className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-25"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scrollBy(1)}
            disabled={!canScrollRight}
            className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-25"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-5 px-8 overflow-x-auto scrollbar-hide pb-6"
        style={{ scrollSnapType: 'x mandatory', cursor: 'grab' }}
        onScroll={updateScrollState}
        onMouseDown={(e) => {
          const el = scrollRef.current;
          const startX = e.pageX - el.offsetLeft;
          const startScroll = el.scrollLeft;
          el.style.cursor = 'grabbing';
          const onMove = (ev) => {
            el.scrollLeft = startScroll - (ev.pageX - el.offsetLeft - startX);
          };
          const onUp = () => {
            el.style.cursor = 'grab';
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
          };
          window.addEventListener('mousemove', onMove);
          window.addEventListener('mouseup', onUp);
        }}
      >
        {EVENT_IMAGES.map((img, i) => (
          <div key={i} style={{ scrollSnapAlign: 'start' }}>
            <GalleryCard image={img} index={i} />
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-8 mt-10">
        <div className="w-full h-[1px] bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[#E31B23] rounded-full"
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>
        <div className="flex justify-between mt-3">
          <span className="text-white/30 text-[9px] font-black tracking-[0.4em] uppercase">Gallery</span>
          <span className="text-white/30 text-[9px] font-black tracking-[0.4em] uppercase">
            {Math.min(Math.round(scrollProgress * EVENT_IMAGES.length) + 1, EVENT_IMAGES.length)} / {EVENT_IMAGES.length}
          </span>
        </div>
      </div>
    </section>
  );
}
