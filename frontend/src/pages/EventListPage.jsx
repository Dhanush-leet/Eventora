import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Zap, TrendingUp, Search, SlidersHorizontal, X, Calendar, Tag } from 'lucide-react';
import { fetchEvents, fetchEventFilters } from '../services/api';
import Header from '../components/common/Header';

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
        day: date.toLocaleDateString('en-IN', { weekday: 'short' }),
        date: date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
        year: date.getFullYear(),
        time: date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };
};

const tier_colors = {
    MOVIE: { bg: 'from-blue-600 to-cyan-500', badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
    CONCERT: { bg: 'from-purple-600 to-pink-500', badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
    SPORTS: { bg: 'from-green-600 to-emerald-500', badge: 'bg-green-500/20 text-green-300 border-green-500/30' },
    THEATRE: { bg: 'from-amber-600 to-orange-500', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
    COMEDY: { bg: 'from-yellow-500 to-orange-400', badge: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' },
    CONFERENCE: { bg: 'from-indigo-600 to-blue-500', badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
    OTHER: { bg: 'from-rose-600 to-pink-500', badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
};

const FillBar = ({ percentage }) => (
    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
        <motion.div
            className={`h-full rounded-full ${percentage > 80 ? 'bg-red-500' : percentage > 50 ? 'bg-amber-400' : 'bg-emerald-400'}`}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
        />
    </div>
);

const EventCard = ({ event, index }) => {
    const navigate = useNavigate();
    const [hovered, setHovered] = useState(false);
    const fmt = formatDate(event.eventDate);
    const colors = tier_colors[event.category] || tier_colors.OTHER;
    const isTrending = event.popularityPercentile >= 90;

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            viewport={{ once: true }}
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
            whileHover={{ y: -6 }}
            onClick={() => navigate(`/events/${event.id}`)}
            className="relative rounded-2xl overflow-hidden cursor-pointer bg-[#111827] border border-white/5 group"
            style={{ boxShadow: hovered ? '0 20px 60px -10px rgba(124,58,237,0.2)' : '0 4px 24px rgba(0,0,0,0.3)' }}
        >
            {/* Image */}
            <div className="relative h-52 overflow-hidden">
                <motion.img
                    src={event.bannerImageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover"
                    animate={{ scale: hovered ? 1.08 : 1 }}
                    transition={{ duration: 0.6 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-[#111827]/30 to-transparent" />
                <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${colors.badge}`}>
                        {event.category}
                    </span>
                    {isTrending && (
                        <motion.span
                            className="px-2.5 py-1 bg-red-500/90 rounded-full text-[10px] font-bold text-white flex items-center gap-1"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <Zap size={10} /> TRENDING
                        </motion.span>
                    )}
                </div>

                {/* Date stamp */}
                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm rounded-xl px-2.5 py-1.5 text-center min-w-[52px]">
                    <p className="text-white/50 text-[9px] uppercase tracking-wider">{fmt.day}</p>
                    <p className="text-white text-sm font-bold leading-tight">{fmt.date}</p>
                </div>

                {/* Fill percentage indicator */}
                {event.fillPercentage > 60 && (
                    <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm rounded-lg px-2 py-1">
                        <p className="text-[10px] text-amber-400 font-semibold">
                            {event.fillPercentage > 90 ? '🔥 Almost Full' : `${event.fillPercentage}% Filled`}
                        </p>
                    </div>
                )}
            </div>

            {/* Card body */}
            <div className="p-5">
                <h3 className="font-bold text-base text-white mb-1 line-clamp-2 leading-snug group-hover:text-purple-300 transition-colors">
                    {event.title}
                </h3>

                {event.artistName && (
                    <p className="text-xs text-white/40 mb-3 line-clamp-1">{event.artistName}</p>
                )}

                <div className="flex items-center gap-3 text-xs text-white/50 mb-3">
                    <span className="flex items-center gap-1"><MapPin size={12} className="text-purple-400" />{event.city}</span>
                    <span className="flex items-center gap-1"><Clock size={12} className="text-purple-400" />{fmt.time}</span>
                </div>

                <div className="mb-4">
                    <div className="flex justify-between text-[10px] text-white/40 mb-1.5">
                        <span>Demand</span>
                        <span className="text-white/60">{event.fillPercentage}% filled</span>
                    </div>
                    <FillBar percentage={event.fillPercentage} />
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[10px] text-white/40 mb-0.5">Starting from</p>
                        <p className="text-lg font-black text-white">
                            ₹{Number(event.currentPrice || event.basePrice).toLocaleString('en-IN')}
                        </p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => { e.stopPropagation(); navigate(`/events/${event.id}`); }}
                        className="px-4 py-2 bg-white/5 hover:bg-purple-600 border border-white/10 hover:border-purple-500 rounded-xl text-white text-xs font-bold transition-all duration-300"
                    >
                        Book Now →
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

const SkeletonCard = () => (
    <div className="rounded-2xl overflow-hidden bg-[#111827] border border-white/5 animate-pulse">
        <div className="h-52 bg-white/5" />
        <div className="p-5 space-y-3">
            <div className="h-4 bg-white/5 rounded w-3/4" />
            <div className="h-3 bg-white/5 rounded w-1/2" />
            <div className="h-2 bg-white/5 rounded w-full" />
            <div className="h-8 bg-white/5 rounded" />
        </div>
    </div>
);

export default function EventListPage() {
    const [filters, setFilters] = useState({ city: '', category: '', search: '' });
    const [inputSearch, setInputSearch] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [page] = useState(0);

    const { data: events, isLoading, isError } = useQuery({
        queryKey: ['events', filters, page],
        queryFn: () => fetchEvents({ ...filters, page, size: 18 }),
        staleTime: 30000,
    });

    const { data: filterOptions } = useQuery({
        queryKey: ['event-filters'],
        queryFn: fetchEventFilters,
        staleTime: 300000,
    });

    const handleSearch = (e) => {
        e.preventDefault();
        setFilters(f => ({ ...f, search: inputSearch }));
    };

    const clearFilter = (key) => setFilters(f => ({ ...f, [key]: '' }));
    const activeFiltersCount = [filters.city, filters.category, filters.search].filter(Boolean).length;

    return (
        <div className="min-h-screen bg-[#0B0F1A]">
            <Header />

            {/* Hero header */}
            <div className="pt-24 pb-10 px-4 md:px-8 max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-3 tracking-tighter">
                        Upcoming{' '}
                        <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                            Events
                        </span>
                    </h1>
                    <p className="text-white/50 text-lg">
                        {events?.totalElements || '...'} real events across India — from concerts to sports
                    </p>
                </motion.div>

                {/* Search bar */}
                <form onSubmit={handleSearch} className="flex gap-3 mb-6">
                    <div className="flex-1 relative">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                        <input
                            type="text"
                            value={inputSearch}
                            onChange={e => setInputSearch(e.target.value)}
                            placeholder="Search events, artists, venues, cities..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-white/30 outline-none focus:border-purple-500 transition-colors"
                        />
                    </div>
                    <button type="submit"
                        className="px-6 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-bold transition-colors">
                        Search
                    </button>
                    <button type="button" onClick={() => setShowFilters(!showFilters)}
                        className={`px-4 py-4 rounded-2xl font-bold border transition-colors flex items-center gap-2 ${showFilters ? 'bg-purple-600 border-purple-500 text-white' : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'}`}>
                        <SlidersHorizontal size={18} />
                        {activeFiltersCount > 0 && (
                            <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {activeFiltersCount}
                            </span>
                        )}
                    </button>
                </form>

                {/* Filter panel */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6 flex flex-wrap gap-4">
                                <div className="flex-1 min-w-[200px]">
                                    <label className="text-xs text-white/50 uppercase tracking-wider mb-2 flex items-center gap-1">
                                        <MapPin size={12} /> City
                                    </label>
                                    <select
                                        value={filters.city}
                                        onChange={e => setFilters(f => ({ ...f, city: e.target.value }))}
                                        className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 transition-colors"
                                    >
                                        <option value="">All Cities</option>
                                        {filterOptions?.cities?.map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex-1 min-w-[200px]">
                                    <label className="text-xs text-white/50 uppercase tracking-wider mb-2 flex items-center gap-1">
                                        <Tag size={12} /> Category
                                    </label>
                                    <select
                                        value={filters.category}
                                        onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}
                                        className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 transition-colors"
                                    >
                                        <option value="">All Categories</option>
                                        {filterOptions?.categories?.map(c => (
                                            <option key={c} value={c}>{c.charAt(0) + c.slice(1).toLowerCase()}</option>
                                        ))}
                                    </select>
                                </div>
                                {activeFiltersCount > 0 && (
                                    <div className="flex items-end">
                                        <button onClick={() => { setFilters({ city: '', category: '', search: '' }); setInputSearch(''); }}
                                            className="px-4 py-3 text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500/10 text-sm font-medium transition-colors flex items-center gap-2">
                                            <X size={14} /> Clear All
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Active filter chips */}
                {activeFiltersCount > 0 && (
                    <div className="flex gap-2 mb-6 flex-wrap">
                        {filters.city && (
                            <span className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 border border-purple-500/30 text-purple-300 rounded-full text-sm">
                                <MapPin size={12} /> {filters.city}
                                <button onClick={() => clearFilter('city')}><X size={12} /></button>
                            </span>
                        )}
                        {filters.category && (
                            <span className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 border border-purple-500/30 text-purple-300 rounded-full text-sm">
                                <Tag size={12} /> {filters.category}
                                <button onClick={() => clearFilter('category')}><X size={12} /></button>
                            </span>
                        )}
                        {filters.search && (
                            <span className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 border border-purple-500/30 text-purple-300 rounded-full text-sm">
                                <Search size={12} /> "{filters.search}"
                                <button onClick={() => { clearFilter('search'); setInputSearch(''); }}><X size={12} /></button>
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Events grid */}
            <div className="px-4 md:px-8 max-w-7xl mx-auto pb-20">
                {isLoading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                )}

                {isError && (
                    <div className="text-center py-24">
                        <p className="text-red-400 text-xl mb-2">Failed to load events</p>
                        <p className="text-white/40">Make sure the backend is running on port 8080</p>
                    </div>
                )}

                {!isLoading && !isError && events?.content?.length === 0 && (
                    <div className="text-center py-24">
                        <p className="text-white/60 text-2xl font-bold mb-2">No events found</p>
                        <p className="text-white/30">Try adjusting your filters or search query</p>
                    </div>
                )}

                {!isLoading && !isError && events?.content && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.content.map((event, i) => (
                            <EventCard key={event.id} event={event} index={i} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
