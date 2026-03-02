import React from 'react';
import { Header } from '../components/common/Header';
import { MainSlider } from '../components/home/MainSlider';
import { MosaicSection } from '../components/home/MosaicSection';
import { ContentSection } from '../components/home/ContentSection';
import { ScrollingMarquee } from '../components/home/ScrollingMarquee';

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

export default function HomePage() {
    return (
        <div className="min-h-screen bg-white selection:bg-[#E31B23] selection:text-white overflow-x-hidden">
            <Header />
            <main className="pt-[80px]">
                <MainSlider />

                <MosaicSection />

                <div className="bg-[#F8F8F8] py-32">
                    <ContentSection
                        title="RECOMMENDED EVENTS"
                        items={recommendedMovies}
                        seeAll={true}
                    />
                </div>

                <div className="py-24 bg-white">
                    <ScrollingMarquee speed={0.5} direction={1} />
                </div>

                <div className="bg-white py-48 text-center border-t border-[#EBEBEB]">
                    <h2 className="text-5xl md:text-[100px] font-black italic tracking-tighter text-[#111111] uppercase mb-10 leading-none">
                        THE BRAND <span className="text-[#E31B23]">PULSE</span>
                    </h2>
                    <p className="text-gray-500 text-2xl max-w-3xl mx-auto px-6 font-bold tracking-[0.3em] uppercase leading-relaxed">
                        "STAGED FOR EXCELLENCE, CURATED FOR DISCOVERY"
                    </p>
                    <button className="mt-20 px-16 py-6 bg-[#E31B23] text-white text-[10px] font-black tracking-[0.4em] rounded-sm hover:scale-105 transition-all shadow-2xl uppercase shadow-[#E31B23]/30 hover:bg-[#c9181f]">
                        Join The Pulse
                    </button>
                </div>
            </main>

            <footer className="bg-[#111111] py-32 text-white text-center">
                <div className="flex flex-col items-center gap-16">
                    <div className="text-5xl font-black italic tracking-tighter text-[#E31B23]">EVENTORA</div>
                    <div className="flex flex-wrap justify-center gap-12 text-gray-400 text-[10px] font-black tracking-widest uppercase">
                        <a href="#" className="hover:text-white transition-colors">Our Story</a>
                        <a href="#" className="hover:text-white transition-colors">Safety</a>
                        <a href="#" className="hover:text-white transition-colors">Legal</a>
                        <a href="#" className="hover:text-white transition-colors">Support</a>
                        <a href="#" className="hover:text-white transition-colors">Careers</a>
                    </div>
                    <p className="text-gray-500 text-[8px] font-black tracking-[0.4em] uppercase max-w-xl leading-loose px-4">
                        © 2026 Eventora Ltd. All Rights Reserved. Crafted for top tier performance and international class.
                    </p>
                </div>
            </footer>
        </div>
    );
}
