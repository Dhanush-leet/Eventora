import React from 'react';
import { motion } from 'framer-motion';

const items = [
    {
        title: 'THE BRAND LIVE',
        subtitle: 'EXPLORE OUR STORY',
        img: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1200&h=800&fit=crop&auto=format',
        size: 'large'
    },
    {
        title: 'TRENDING CATEGORIES',
        subtitle: 'MUST HAVE EVENTS',
        img: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&h=800&fit=crop&auto=format',
        size: 'small'
    },
    {
        title: 'GLOBAL REACH',
        subtitle: 'DISCOVER WORLDWIDE',
        img: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=800&fit=crop&auto=format',
        size: 'small'
    }
];

export const MosaicSection = () => {
    return (
        <div className="max-w-7xl mx-auto px-8 py-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 50, scale: 0.98 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: i * 0.2, ease: "easeOut" }}
                    className={`relative overflow-hidden rounded-sm cursor-pointer group shadow-2xl ${item.size === 'large' ? 'lg:col-span-2 aspect-[16/9]' : 'aspect-square'}`}
                >
                    <img
                        src={item.img}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-all duration-[4000ms] ease-in-out"
                    />
                    {/* Stronger Overlay for contrast and visibility */}
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/60 transition-all duration-700" />

                    <div className="absolute inset-0 flex flex-col justify-end p-10 md:p-14 text-center">
                        <motion.span
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="text-white text-[12px] font-black tracking-[0.6em] mb-4 uppercase shadow-black drop-shadow-lg"
                        >
                            {item.subtitle}
                        </motion.span>
                        <h2 className="text-white text-5xl md:text-[80px] font-black italic tracking-tighter leading-none mb-6 uppercase shadow-black drop-shadow-2xl">
                            {item.title}
                        </h2>
                        <div className="flex justify-center flex-col items-center gap-4">
                            <div className="h-1 bg-[#E31B23] transition-all duration-700 w-12 group-hover:w-full" />
                            <span className="text-white text-[10px] font-black uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-500 shadow-black drop-shadow-lg">
                                See More
                            </span>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};
