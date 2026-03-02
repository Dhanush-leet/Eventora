import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Play, ArrowRight, Zap, Target, Clapperboard } from 'lucide-react';

export const Hero = () => {
    const containerRef = useRef(null);
    const { scrollY } = useScroll();

    const yParallax = useTransform(scrollY, [0, 800], [0, 300]);
    const yParallaxInverted = useTransform(scrollY, [0, 800], [0, -200]);
    const rotateParallax = useTransform(scrollY, [0, 800], [0, 15]);
    const opacityFade = useTransform(scrollY, [0, 500], [1, 0]);

    return (
        <div ref={containerRef} className="relative w-full min-h-[160vh] bg-white pt-32 pb-48 overflow-hidden flex flex-col items-center">
            {/* Background Animated Blobs - Enhances "Graphics" */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    animate={{
                        rotate: 360,
                        x: [0, 50, 0],
                        y: [0, 30, 0]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className="absolute -top-1/4 -left-1/4 w-full h-full bg-accent-primary/5 blur-[120px] rounded-full"
                />
                <motion.div
                    animate={{
                        rotate: -360,
                        x: [0, -30, 0],
                        y: [0, -50, 0]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                    className="absolute -bottom-1/4 -right-1/4 w-full h-full bg-accent-secondary/5 blur-[120px] rounded-full"
                />
            </div>

            <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col items-center text-center">
                {/* Animated Badge Header */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                    className="flex items-center gap-3 bg-zinc-50 px-6 py-2 rounded-full border border-zinc-100 mb-16 shadow-lg shadow-black/5 hover:scale-105 transition-all duration-500 cursor-pointer group"
                >
                    <div className="w-2 h-2 rounded-full bg-accent-secondary animate-pulse" />
                    <span className="text-[10px] font-bold tracking-[0.3em] text-zinc-400 uppercase group-hover:text-zinc-600">Eventora Pulse Protocol V3.0</span>
                    <ArrowRight size={10} className="text-zinc-300 group-hover:translate-x-1 transition-transform" />
                </motion.div>

                {/* Cinematic Split Headline */}
                <motion.div
                    style={{ opacity: opacityFade }}
                    className="flex flex-col items-center perspective-[2000px]"
                >
                    <motion.h1
                        initial={{ opacity: 0, y: 50, rotateX: 20 }}
                        animate={{ opacity: 1, y: 0, rotateX: 0 }}
                        transition={{ duration: 1.2, ease: "circOut" }}
                        className="font-display font-medium leading-[0.9] tracking-[-0.06em]"
                    >
                        <span className="block text-5xl md:text-[140px] text-zinc-900 mb-4 whitespace-nowrap">THE ULTIMATE</span>
                        <span className="block text-6xl md:text-[160px] font-black italic tracking-[-0.05em] [-webkit-text-stroke:2px_#18181b] text-transparent bg-clip-text bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-400 bg-[length:200%_auto] hover:bg-right transition-all duration-1000">
                            DISCOVERY
                        </span>
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8, duration: 2 }}
                        className="mt-16 max-w-2xl px-4"
                    >
                        <p className="text-zinc-400 text-xl font-body leading-relaxed tracking-wide italic">
                            "Curated by experts, powered by demand."
                            <br />
                            <span className="text-zinc-900 font-bold not-italic mt-4 block text-2xl">
                                Experience the next generation of event tracking.
                            </span>
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 1 }}
                        className="mt-16 flex flex-wrap justify-center gap-6"
                    >
                        <button className="px-12 py-6 bg-zinc-900 text-white rounded-full font-black text-xs tracking-widest hover:scale-105 transition-all shadow-[0_25px_50px_-12px_rgba(0,0,0,0.3)] uppercase">
                            Enter The Hub
                        </button>
                        <button className="px-12 py-6 bg-white text-zinc-900 border border-zinc-200 rounded-full font-black text-xs tracking-widest hover:bg-zinc-50 transition-all uppercase flex items-center gap-2">
                            Browse Pulse <Play size={16} fill="black" />
                        </button>
                    </motion.div>
                </motion.div>

                {/* 3D Main Stage Image with Interactive Parallax */}
                <motion.div
                    initial={{ opacity: 0, y: 200, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.8, duration: 1.5, ease: "easeOut" }}
                    style={{ y: yParallaxInverted, rotateX: rotateParallax }}
                    className="mt-48 w-full max-w-6xl aspect-[16/9] rounded-[60px] overflow-hidden shadow-[0_120px_150px_-30px_rgba(0,0,0,0.15)] bg-zinc-100 relative group"
                >
                    <img
                        src="https://picsum.photos/seed/hero/1600/900"
                        alt="Interstellar Experience"
                        className="w-full h-full object-cover group-hover:scale-110 transition-all duration-[3000ms] cursor-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-20">
                        <div className="text-left flex flex-col gap-4">
                            <motion.div
                                whileHover={{ x: 10 }}
                                className="flex items-center gap-2 text-white/50 text-xs tracking-[0.4em] font-black uppercase"
                            >
                                <div className="w-8 h-[2px] bg-accent-secondary" /> Featured Spotlight
                            </motion.div>
                            <h2 className="text-white text-6xl md:text-8xl font-display font-medium tracking-tighter leading-none italic">
                                INTERSTELLAR <br /> 70MM IMAX
                            </h2>
                        </div>
                    </div>

                    {/* Floating Glass Graphic Elements - "Graphics" heavy */}
                    <motion.div
                        animate={{ y: [0, -20, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute top-1/4 right-10 glass-card p-8 rounded-[32px] hidden lg:block"
                    >
                        <div className="flex flex-col gap-2">
                            <div className="text-accent-secondary font-black text-xs uppercase tracking-widest">Global Demand</div>
                            <div className="text-4xl font-display font-bold text-zinc-900 italic">4.9/5</div>
                        </div>
                    </motion.div>

                    <motion.div
                        animate={{ y: [0, 20, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                        className="absolute bottom-1/4 left-10 glass-card p-8 rounded-[32px] hidden lg:block"
                    >
                        <div className="flex flex-col gap-2">
                            <div className="text-accent-primary font-black text-xs uppercase tracking-widest">Venue Capacity</div>
                            <div className="text-4xl font-display font-bold text-zinc-900 italic">98.2%</div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Decorative Graphics - Vertical Lines and Grid - "International Look" */}
            <div className="absolute top-[30%] left-[8%] w-px h-1/2 bg-gradient-to-b from-transparent via-zinc-100 to-transparent pointer-events-none" />
            <div className="absolute top-[40%] right-[8%] w-px h-1/2 bg-gradient-to-b from-transparent via-zinc-100 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-[0.02] pointer-events-none" />
        </div>
    );
};
