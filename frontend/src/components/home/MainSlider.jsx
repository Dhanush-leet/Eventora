import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
    {
        id: 1,
        title: "THE ULTIMATE PULSE",
        subtitle: "STAGED FOR EXCELLENCE",
        type: "video",
        url: "https://assets.mixkit.co/videos/preview/mixkit-crowd-in-a-concert-15183-large.mp4",
        fallback: "https://images.unsplash.com/photo-1540039155732-6761b54cbaca?w=1600&auto=format&fit=crop"
    },
    {
        id: 2,
        title: "GLOBAL DISCOVERY",
        subtitle: "YOUR TRAVEL BUDDY FOR EVENTS",
        type: "image",
        url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600&auto=format&fit=crop"
    },
    {
        id: 3,
        title: "BESPOKE EXPERIENCES",
        subtitle: "CURATED BY WORLD EXPERTS",
        type: "image",
        url: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1600&auto=format&fit=crop"
    }
];

export const MainSlider = () => {
    const [current, setCurrent] = useState(0);

    const next = () => setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    const prev = () => setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

    useEffect(() => {
        const timer = setInterval(next, 8000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative w-full h-[85vh] bg-[#EBEBEB] overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="absolute inset-0"
                >
                    {slides[current].type === 'video' ? (
                        <video
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="w-full h-full object-cover"
                            poster={slides[current].fallback}
                        >
                            <source src={slides[current].url} type="video/mp4" />
                        </video>
                    ) : (
                        <img
                            src={slides[current].url}
                            alt={slides[current].title}
                            className="w-full h-full object-cover"
                        />
                    )}

                    <div className="absolute inset-0 bg-black/40" />

                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                        <motion.span
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-white text-sm md:text-base font-black tracking-[0.5em] mb-6 uppercase shadow-black drop-shadow-lg"
                        >
                            {slides[current].subtitle}
                        </motion.span>
                        <motion.h1
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className="text-white text-5xl md:text-[120px] font-black italic tracking-tighter leading-none uppercase shadow-black drop-shadow-2xl"
                        >
                            {slides[current].title}
                        </motion.h1>
                        <motion.button
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.9 }}
                            className="mt-16 px-12 py-5 bg-[#E31B23] text-white text-[10px] font-black tracking-[0.3em] rounded-sm hover:scale-105 transition-all uppercase shadow-xl hover:shadow-[#E31B23]/50"
                        >
                            Discover Now
                        </motion.button>
                    </div>
                </motion.div>
            </AnimatePresence>

            <button onClick={prev} className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 z-20 text-white/40 hover:text-white transition-all">
                <ChevronLeft size={80} strokeWidth={0.5} />
            </button>
            <button onClick={next} className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 z-20 text-white/40 hover:text-white transition-all">
                <ChevronRight size={80} strokeWidth={0.5} />
            </button>

            <div className="absolute bottom-12 w-full flex justify-center gap-4 z-20">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={`h-1 transition-all duration-500 rounded-full ${current === i ? 'bg-[#E31B23] w-16' : 'bg-white/40 w-8'}`}
                    />
                ))}
            </div>
        </div>
    );
};
