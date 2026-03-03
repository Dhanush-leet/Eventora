import React, { useState, useEffect } from 'react';
import { Search, MapPin, User, Menu, X, ChevronDown, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthModal } from './AuthModal';

export const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 bg-white border-[#EBEBEB] border-b ${isScrolled ? 'py-3' : 'py-6'}`}>
            <div className="max-w-7xl mx-auto px-4 md:px-12 flex items-center justify-between">
                <div className="flex items-center gap-12">
                    <div className="text-2xl font-black italic tracking-tighter text-[#E31B23] cursor-pointer">
                        EVENT<span className="text-black">ORA</span>
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden lg:flex items-center gap-6 xl:gap-10 text-[11px] font-black uppercase tracking-[0.2em] text-black">
                        <a href="#" className="flex items-center gap-1 hover:text-[#E31B23] transition-colors">Movies <ChevronDown size={14} /></a>
                        <a href="#" className="flex items-center gap-1 hover:text-[#E31B23] transition-colors">Stream <ChevronDown size={14} /></a>
                        <a href="#" className="flex items-center gap-1 hover:text-[#E31B23] transition-colors">Events <ChevronDown size={14} /></a>
                        <a href="#" className="flex items-center gap-1 hover:text-[#E31B23] transition-colors">Plays <ChevronDown size={14} /></a>
                        <a href="#" className="flex items-center gap-1 hover:text-[#E31B23] transition-colors">Sports <ChevronDown size={14} /></a>
                    </div>
                </div>

                {/* Action Hub */}
                <div className="flex items-center gap-6 xl:gap-8 text-black">
                    <div className="hidden md:flex items-center bg-transparent border-[#EBEBEB] border px-4 py-2 rounded-sm cursor-pointer hover:bg-[#EBEBEB] transition-all">
                        <Search size={16} className="text-gray-500" />
                    </div>

                    <div className="hidden lg:flex items-center gap-1 cursor-pointer hover:text-[#E31B23] transition-colors text-[10px] font-black uppercase tracking-[0.2em]">
                        <MapPin size={16} />
                        <span>Mumbai</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <button
                            className="hidden md:block w-5 h-5 text-black hover:text-[#E31B23] transition-all"
                            onClick={() => setIsAuthModalOpen(true)}
                        >
                            <User size={20} />
                        </button>
                        <button className="relative w-5 h-5 text-black hover:text-[#E31B23] transition-all">
                            <ShoppingBag size={20} />
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#E31B23] rounded-full" />
                        </button>
                    </div>

                    <button
                        className="lg:hidden text-black"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <Menu size={24} />
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        className="fixed inset-0 z-[200] bg-white lg:hidden p-8 flex flex-col gap-10"
                    >
                        <div className="flex justify-between items-center">
                            <div className="text-2xl font-black italic tracking-tighter text-[#E31B23]">
                                EVENT<span className="text-black">ORA</span>
                            </div>
                            <button onClick={() => setIsMobileMenuOpen(false)} className="text-black">
                                <X size={32} />
                            </button>
                        </div>

                        <div className="flex flex-col gap-8 text-3xl font-black italic text-black uppercase mt-12">
                            <a href="#">Movies</a>
                            <a href="#">Events</a>
                            <a href="#">Sports</a>
                            <a href="#">Plays</a>
                            <a href="#">Stream</a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />
        </nav>
    );
};
