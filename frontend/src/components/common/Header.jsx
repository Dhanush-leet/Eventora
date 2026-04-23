import React, { useState, useEffect } from 'react';
import { Search, MapPin, User, Menu, X, ChevronDown, ShoppingBag, LogOut, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthModal } from './AuthModal';
import { useAuthStore } from '../../store/authStore';
import { useLocationStore } from '../../store/locationStore';

const locations = {
    "Delhi": ["New Delhi"],
    "Karnataka": ["Bangalore", "Mysore"],
    "Maharashtra": ["Mumbai", "Pune"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai"],
    "Telangana": ["Hyderabad"],
    "West Bengal": ["Kolkata"]
};

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isLocationMenuOpen, setIsLocationMenuOpen] = useState(false);
    const [imgError, setImgError] = useState(false);

    const { user, isLoggedIn, logout } = useAuthStore();
    const { location, setLocation } = useLocationStore();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 bg-white border-[#EBEBEB] border-b ${isScrolled ? 'py-3' : 'py-6'}`}>
            <div className="max-w-7xl mx-auto px-4 md:px-12 flex items-center justify-between">
                <div className="flex items-center gap-12">
                    <div className="text-2xl font-black italic tracking-tighter text-[#E31B23] cursor-pointer" onClick={() => window.location.href = '/'}>
                        EVENT<span className="text-black">ORA</span>
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden lg:flex items-center gap-6 xl:gap-10 text-[11px] font-black uppercase tracking-[0.2em] text-black">
                        <a href="/movies" className="flex items-center gap-1 hover:text-[#E31B23] transition-colors">Movies <ChevronDown size={14} /></a>
                        <a href="/stream" className="flex items-center gap-1 hover:text-[#E31B23] transition-colors">Stream <ChevronDown size={14} /></a>
                        <a href="/events" className="flex items-center gap-1 hover:text-[#E31B23] transition-colors">Events <ChevronDown size={14} /></a>
                        <a href="/plays" className="flex items-center gap-1 hover:text-[#E31B23] transition-colors">Plays <ChevronDown size={14} /></a>
                        <a href="/sports" className="flex items-center gap-1 hover:text-[#E31B23] transition-colors">Sports <ChevronDown size={14} /></a>
                    </div>
                </div>

                {/* Action Hub */}
                <div className="flex items-center gap-6 xl:gap-8 text-black">
                    <div className="hidden md:flex items-center bg-transparent border-[#EBEBEB] border px-4 py-2 rounded-sm cursor-pointer hover:bg-[#EBEBEB] transition-all">
                        <Search size={16} className="text-gray-500" />
                    </div>

                    <div className="relative">
                        <div 
                            className="hidden lg:flex items-center gap-1 cursor-pointer hover:text-[#E31B23] transition-colors text-[10px] font-black uppercase tracking-[0.2em]"
                            onClick={() => setIsLocationMenuOpen(!isLocationMenuOpen)}
                        >
                            <MapPin size={16} />
                            <span>{location}</span>
                        </div>
                        
                        <AnimatePresence>
                            {isLocationMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute top-8 -right-10 w-[350px] bg-white border border-[#EBEBEB] shadow-2xl rounded-2xl py-4 z-50 flex flex-col overflow-hidden max-h-[400px] overflow-y-auto"
                                >
                                    {Object.entries(locations).map(([state, cities]) => (
                                        <div key={state} className="px-5 py-3">
                                            <div className="text-[10px] font-black tracking-widest text-[#E31B23] uppercase mb-2 border-b border-[#EBEBEB] pb-1">{state}</div>
                                            <div className="grid grid-cols-2 gap-2">
                                                {cities.map(city => (
                                                    <button 
                                                        key={city}
                                                        onClick={() => {
                                                            setLocation(city);
                                                            setIsLocationMenuOpen(false);
                                                        }}
                                                        className={`text-left text-xs font-bold p-2 transition-colors rounded-lg ${location === city ? 'bg-[#E31B23]/10 text-[#E31B23]' : 'text-black hover:bg-[#F8F8F8]'}`}
                                                    >
                                                        {city}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="flex items-center gap-6">
                        {isLoggedIn && user ? (
                            <div className="relative">
                                <div 
                                    className="hidden md:flex items-center gap-3 cursor-pointer group"
                                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#E31B23] to-[#7C3AED] p-[2px] shadow-lg group-hover:scale-105 transition-transform duration-300">
                                        {user.profileImageUrl && !imgError ? (
                                            <img 
                                                src={user.profileImageUrl} 
                                                alt="Profile" 
                                                className="w-full h-full rounded-full border-2 border-white object-cover"
                                                referrerPolicy="no-referrer"
                                                onError={() => setImgError(true)}
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-black rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                                                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-[11px] font-black uppercase tracking-[0.1em] text-black group-hover:text-[#E31B23] transition-colors max-w-[100px] truncate hide-on-scrolled">
                                        Hi, {user.name ? user.name.split(' ')[0] : 'Pulse'}
                                    </span>
                                </div>
                                
                                <AnimatePresence>
                                    {isProfileMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-12 right-0 w-56 bg-white border border-[#EBEBEB] shadow-2xl rounded-2xl py-2 z-50 flex flex-col overflow-hidden"
                                        >
                                            <div className="px-5 py-4 border-b border-[#EBEBEB] mb-2 bg-[#F8F8F8]">
                                                <div className="text-[9px] font-black tracking-widest text-[#E31B23] uppercase mb-0.5">Signed in as</div>
                                                <div className="text-xs font-bold text-black truncate">{user.email || 'user@eventora.com'}</div>
                                            </div>
                                            <a href="/dashboard" className="px-5 py-3.5 flex items-center gap-3 text-xs font-black uppercase tracking-wider hover:bg-[#F8F8F8] transition-colors text-[#111111] hover:text-[#E31B23]">
                                                <LayoutDashboard size={14} /> Dashboard
                                            </a>
                                            <button 
                                                onClick={() => {
                                                    setIsProfileMenuOpen(false);
                                                    logout();
                                                }}
                                                className="px-5 py-3.5 flex items-center gap-3 text-xs font-black uppercase tracking-wider hover:bg-red-50 transition-colors text-left text-red-600"
                                            >
                                                <LogOut size={14} /> Log Out
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <button
                                className="hidden md:block w-5 h-5 text-black hover:text-[#E31B23] transition-all"
                                onClick={() => setIsAuthModalOpen(true)}
                            >
                                <User size={20} />
                            </button>
                        )}
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
                            <a href="/movies">Movies</a>
                            <a href="/events">Events</a>
                            <a href="/sports">Sports</a>
                            <a href="/plays">Plays</a>
                            <a href="/stream">Stream</a>
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

export default Header;
