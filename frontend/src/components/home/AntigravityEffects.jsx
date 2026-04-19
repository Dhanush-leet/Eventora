import React, { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useMousePosition } from '../../hooks/useMousePosition';

// --- Floating Object (pure antigravity loop) ---
export function FloatingOrb({ size = 80, color = '#E31B23', delay = 0, className = '' }) {
  return (
    <motion.div
      className={`rounded-full pointer-events-none ${className}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 35% 35%, ${color}cc, ${color}44)`,
        boxShadow: `0 0 ${size * 0.4}px ${color}66`,
      }}
      animate={{
        y: [0, -28, 0],
        rotate: [0, 6, 0],
        scale: [1, 1.04, 1],
      }}
      transition={{
        duration: 4.5,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {/* Dynamic shadow beneath */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 rounded-full"
        style={{
          bottom: -size * 0.25,
          width: size * 0.7,
          height: size * 0.2,
          background: `${color}33`,
          filter: 'blur(8px)',
        }}
        animate={{
          scaleX: [1, 1.3, 1],
          opacity: [0.5, 0.2, 0.5],
        }}
        transition={{ duration: 4.5, delay, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.div>
  );
}

// --- Levitating Event Card ---
export function LevitatingCard({ children, className = '', intensity = 1 }) {
  const cardRef = useRef(null);
  const mousePos = useMousePosition();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setTilt({
      x: ((e.clientY - cy) / rect.height) * 10 * intensity,
      y: -((e.clientX - cx) / rect.width) * 10 * intensity,
    });
  }, [intensity]);

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <motion.div
      ref={cardRef}
      className={`relative ${className}`}
      style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
      animate={{ y: [0, -18, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      whileHover={{ y: -28, scale: 1.02 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{ rotateX: tilt.x, rotateY: tilt.y }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        {children}
      </motion.div>

      {/* Floating shadow */}
      <motion.div
        className="absolute -bottom-6 left-1/2 -translate-x-1/2 rounded-full"
        style={{
          width: '70%',
          height: '20px',
          background: 'rgba(0,0,0,0.4)',
          filter: 'blur(14px)',
        }}
        animate={{ scaleX: [1, 1.2, 1], opacity: [0.5, 0.25, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.div>
  );
}

// --- Floating Text ---
export function FloatingText({ text, className = '' }) {
  return (
    <div className={`flex gap-1 flex-wrap ${className}`}>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          animate={{
            y: [0, -(12 + (i % 3) * 4), 0],
            rotate: [0, Math.sin(i) * 5, 0],
          }}
          transition={{
            duration: 2.5 + i * 0.07,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.05,
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </div>
  );
}

// --- Antigravity Particles (rising from bottom) ---
export function AntigravityParticles({ count = 30 }) {
  const particles = React.useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        duration: 6 + Math.random() * 6,
        delay: Math.random() * 4,
        left: Math.random() * 100,
        size: Math.random() * 4 + 2,
        color: i % 3 === 0 ? '#E31B23' : i % 3 === 1 ? '#ffffff' : '#E31B2355',
      })),
    [count]
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            bottom: '-10px',
            background: p.color,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
          }}
          animate={{
            y: [0, -(typeof window !== 'undefined' ? window.innerHeight + 100 : 900)],
            opacity: [0, 0.8, 0],
            x: [0, Math.sin(p.id) * 60],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}

// --- Magnetic Levitation Zone ---
export function MagneticZone({ children, className = '' }) {
  const containerRef = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const onMove = useCallback((e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    setOffset({
      x: (e.clientX - rect.left - cx) * 0.15,
      y: (e.clientY - rect.top - cy) * 0.15,
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      onMouseMove={onMove}
      onMouseLeave={() => setOffset({ x: 0, y: 0 })}
    >
      <motion.div
        animate={{ x: offset.x, y: offset.y }}
        transition={{ type: 'spring', stiffness: 200, damping: 20, mass: 0.5 }}
      >
        {children}
      </motion.div>
    </div>
  );
}
