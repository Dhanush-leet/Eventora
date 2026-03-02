import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const images = [
    'https://picsum.photos/seed/marquee1/800/600', // Coldplay
    'https://picsum.photos/seed/marquee2/800/600', // Ed Sheeran
    'https://picsum.photos/seed/marquee3/800/600', // Rahman
    'https://picsum.photos/seed/marquee4/800/600', // Concert
    'https://picsum.photos/seed/marquee5/800/600', // Festival
    'https://picsum.photos/seed/marquee6/800/600', // Crowd
    'https://picsum.photos/seed/marquee7/800/600', // Party
];

export function ScrollingMarquee({ speed = 1, direction = 1 }) {
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start end", "end start"]
    });

    const x = useTransform(scrollYProgress, [0, 1], direction > 0 ? ["-40%", "40%"] : ["40%", "-40%"]);

    return (
        <div ref={targetRef} className="relative overflow-hidden py-24 bg-white selection:bg-[#E31B23] selection:text-white">
            <motion.div style={{ x }} className="flex gap-16 whitespace-nowrap">
                {images.map((src, i) => (
                    <motion.div
                        key={i}
                        className="flex-shrink-0 w-[600px] h-[400px] rounded-sm overflow-hidden shadow-2xl relative group"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.8, ease: "circOut" }}
                    >
                        <img
                            src={src}
                            alt={`Gallery ${i}`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-all duration-[4000ms] grayscale hover:grayscale-0"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white font-black text-xs tracking-widest uppercase shadow-black drop-shadow-lg">DISCOVER THE PULSE</span>
                        </div>
                    </motion.div>
                ))}
                {/* Duplicate for continuity */}
                {images.map((src, i) => (
                    <motion.div
                        key={`dup-${i}`}
                        className="flex-shrink-0 w-[600px] h-[400px] rounded-sm overflow-hidden shadow-2xl relative group"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.8, ease: "circOut" }}
                    >
                        <img
                            src={src}
                            alt={`Gallery ${i}`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-all duration-[4000ms] grayscale hover:grayscale-0"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white font-black text-xs tracking-widest uppercase shadow-black drop-shadow-lg">DISCOVER THE PULSE</span>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}
