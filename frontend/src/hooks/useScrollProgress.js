import { useRef } from 'react';
import { useScroll, useTransform } from 'framer-motion';

export function useScrollProgress(offset = ['start end', 'end start']) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset });
  return { ref, scrollYProgress };
}

export function useParallaxY(scrollYProgress, from = 0, to = -100) {
  return useTransform(scrollYProgress, [0, 1], [from, to]);
}
