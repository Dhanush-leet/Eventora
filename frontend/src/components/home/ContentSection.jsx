import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Play } from 'lucide-react';

const Card = ({ title, sub, genre, img, rating }) => (
    <motion.div
        className="flex flex-col gap-6 min-w-[320px] cursor-pointer group pb-12"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -12 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
        <div className="relative overflow-hidden rounded-[40px] aspect-[2/3] bg-[#EBEBEB] shadow-2xl group-hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.15)] transition-all duration-700">
            <img
                src={img}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-110 transition-all duration-[3000ms] ease-out grayscale-[20%] group-hover:grayscale-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-700" />

            {rating && (
                <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between pointer-events-none">
                    <div className="flex flex-col">
                        <span className="text-white text-4xl font-black italic tracking-tighter drop-shadow-2xl">★ {rating}</span>
                        <span className="text-white/70 text-[10px] font-black tracking-[0.4em] uppercase mt-1">Live Rating</span>
                    </div>
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.1 }}
                        className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0"
                    >
                        <Play size={20} className="text-white fill-white ml-1" />
                    </motion.div>
                </div>
            )}
        </div>

        <div className="flex flex-col px-6">
            <h4 className="font-display font-black text-3xl text-[#111111] group-hover:text-[#E31B23] transition-all duration-500 uppercase italic tracking-tighter leading-none mb-3">
                {title}
            </h4>
            <div className="flex items-center gap-4">
                {genre && (
                    <span className="text-[12px] font-black text-gray-500 uppercase tracking-[0.3em] opacity-60 group-hover:opacity-100 transition-opacity">
                        {genre}
                    </span>
                )}
                <div className="w-1.5 h-1.5 rounded-full bg-[#E31B23] animate-pulse" />
                <span className="text-[12px] font-black text-[#111111] uppercase tracking-[0.3em]">Trending Pulse</span>
            </div>
        </div>
    </motion.div>
);

export const ContentSection = ({ title, items, seeAll }) => {
    return (
        <div className="max-w-7xl mx-auto px-6 py-32">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-1.5 bg-[#E31B23] rounded-full" />
                        <span className="text-[#E31B23] font-black tracking-[0.6em] text-[10px] uppercase">Curated Collection</span>
                    </div>
                    <h2 className="text-6xl md:text-8xl font-display font-black tracking-tighter text-[#111111] italic uppercase leading-none">
                        {title}
                    </h2>
                </div>
                {seeAll && (
                    <button className="flex items-center gap-3 text-[#111111] font-black uppercase tracking-[0.4em] group hover:text-[#E31B23] transition-all text-xs border-b-2 border-transparent hover:border-[#E31B23] pb-2">
                        Browse Full Hub <ChevronRight size={16} className="group-hover:translate-x-2 transition-transform duration-500" />
                    </button>
                )}
            </div>
            <div className="flex gap-12 overflow-x-auto pb-16 scrollbar-hide snap-x">
                {items.map((item, i) => (
                    <div key={i} className="snap-start pointer-events-auto">
                        <Card {...item} />
                    </div>
                ))}
            </div>
        </div>
    );
};
