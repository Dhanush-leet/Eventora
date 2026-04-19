import React from 'react';
import Header from '../components/common/Header';
import HeroSection from '../components/home/HeroSection';
import HorizontalScrollGallery from '../components/home/HorizontalScrollGallery';
import VerticalScrollShowcase from '../components/home/VerticalScrollShowcase';
import { MosaicSection } from '../components/home/MosaicSection';
import { ContentSection } from '../components/home/ContentSection';
import { ScrollingMarquee } from '../components/home/ScrollingMarquee';
import { AntigravityParticles, FloatingOrb, LevitatingCard, FloatingText, MagneticZone } from '../components/home/AntigravityEffects';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const recommendedMovies = [
    {
        title: 'THE DARK KNIGHT',
        genre: 'Action/Drama',
        rating: '9.5',
        img: 'https://picsum.photos/seed/darkknight/800/600'
    },
    {
        title: 'INTERSTELLAR',
        genre: 'Sci-Fi/Adventure',
        rating: '9.2',
        img: 'https://picsum.photos/seed/interstellar/800/600'
    },
    {
        title: 'INCEPTION',
        genre: 'Sci-Fi/Thriller',
        rating: '9.0',
        img: 'https://picsum.photos/seed/inception/800/600'
    },
    {
        title: 'DUNE: PART TWO',
        genre: 'Sci-Fi/Adventure',
        rating: '9.6',
        img: 'https://picsum.photos/seed/dune/800/600'
    }
];

// Stats strip
const STATS = [
    { value: '50K+', label: 'Events Hosted' },
    { value: '2M+', label: 'Tickets Sold' },
    { value: '180+', label: 'Cities Worldwide' },
    { value: '99.8%', label: 'Uptime Guaranteed' },
];

function StatsSection() {
    const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });
    return (
        <section ref={ref} className="bg-[#111111] py-24 border-y border-white/5">
            <div className="max-w-7xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                {STATS.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: i * 0.1, duration: 0.7 }}
                    >
                        <div className="text-5xl md:text-6xl font-black italic text-white tracking-tighter leading-none mb-2">
                            {stat.value}
                        </div>
                        <div className="text-white/40 text-[9px] font-black tracking-[0.5em] uppercase">
                            {stat.label}
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}

// Antigravity showcase brand zone
function BrandPulseSection() {
    const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });

    return (
        <section ref={ref} className="relative bg-[#0a0a0a] py-48 text-center overflow-hidden">
            {/* Animated rising particles */}
            <AntigravityParticles count={25} />

            {/* Floating accent orbs */}
            <FloatingOrb size={120} color="#E31B23" delay={0} className="absolute left-[8%] top-[15%] opacity-30" />
            <FloatingOrb size={60} color="#ffffff" delay={1.5} className="absolute right-[12%] top-[30%] opacity-15" />
            <FloatingOrb size={80} color="#E31B23" delay={2.5} className="absolute left-[20%] bottom-[20%] opacity-20" />

            <div className="relative z-10 max-w-5xl mx-auto px-8">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                >
                    <FloatingText
                        text="THE BRAND PULSE"
                        className="text-5xl md:text-[80px] lg:text-[100px] font-black italic tracking-tighter text-white uppercase justify-center leading-none mb-10"
                    />
                </motion.div>

                <motion.p
                    className="text-white/50 text-xl max-w-2xl mx-auto px-6 font-medium tracking-[0.2em] uppercase leading-relaxed mb-16"
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.5, duration: 1 }}
                >
                    "Staged for Excellence, Curated for Discovery"
                </motion.p>

                <MagneticZone>
                    <motion.button
                        className="px-16 py-6 bg-[#E31B23] text-white text-[10px] font-black tracking-[0.4em] rounded-sm uppercase shadow-2xl shadow-[#E31B23]/30 hover:shadow-[#E31B23]/60 transition-all duration-500"
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.96 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.8, duration: 0.8 }}
                    >
                        Join The Pulse
                    </motion.button>
                </MagneticZone>
            </div>
        </section>
    );
}

export default function HomePage() {
    return (
        <div className="min-h-screen bg-[#0f0e0d] selection:bg-[#E31B23] selection:text-white overflow-x-hidden">
            <Header />

            <main>
                {/* 1. Alef-style cinematic parallax hero */}
                <HeroSection />

                {/* 2. Stats strip */}
                <StatsSection />

                {/* 3. Horizontal drag-scroll gallery */}
                <HorizontalScrollGallery title="EXPLORE EVENTS" />

                {/* 4. Scrolling marquee strip */}
                <div className="bg-[#111111] py-12 border-y border-white/5">
                    <ScrollingMarquee speed={0.5} direction={1} />
                </div>

                {/* 5. Vertical parallax image showcase */}
                <VerticalScrollShowcase title="FEATURED EXPERIENCES" />

                {/* 6. Mosaic grid */}
                <div className="bg-[#111111] py-4">
                    <MosaicSection />
                </div>

                {/* 7. Recommended events cards */}
                <div className="bg-[#0f0e0d] py-32">
                    <ContentSection
                        title="RECOMMENDED EVENTS"
                        items={recommendedMovies}
                        seeAll={true}
                    />
                </div>

                {/* 8. Brand Pulse – antigravity showcase */}
                <BrandPulseSection />
            </main>

            {/* Footer */}
            <footer className="bg-[#080808] py-28 text-white border-t border-white/5">
                <div className="max-w-7xl mx-auto px-8 flex flex-col items-center gap-14">
                    <MagneticZone>
                        <div className="text-5xl font-black italic tracking-tighter text-[#E31B23] select-none">
                            EVENTORA
                        </div>
                    </MagneticZone>

                    <div className="flex flex-wrap justify-center gap-10 text-white/40 text-[9px] font-black tracking-[0.5em] uppercase">
                        {['Our Story', 'Safety', 'Legal', 'Support', 'Careers'].map((link) => (
                            <a key={link} href="#" className="hover:text-white transition-colors duration-300">
                                {link}
                            </a>
                        ))}
                    </div>

                    <p className="text-white/20 text-[8px] font-black tracking-[0.4em] uppercase max-w-xl text-center leading-loose px-4">
                        © 2026 Eventora Ltd. All Rights Reserved. Crafted for top tier performance and international class.
                    </p>
                </div>
            </footer>
        </div>
    );
}
