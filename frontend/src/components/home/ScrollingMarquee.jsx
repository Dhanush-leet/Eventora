import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const images = [
    'https://images.unsplash.com/photo-1540039155732-6761b54cbaca?w=800&auto=format&fit=crop', // Coldplay
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop', // Ed Sheeran
    'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&auto=format&fit=crop', // Rahman
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop', // Concert
    'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&auto=format&fit=crop', // Festival
    'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&auto=format&fit=crop', // Crowd
    'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&auto=format&fit=crop', // Party
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
