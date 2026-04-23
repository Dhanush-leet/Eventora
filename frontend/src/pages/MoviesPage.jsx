import React, { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import ElegantHero from '../components/discovery/ElegantHero';
import ElegantCard from '../components/discovery/ElegantCard';
import { fetchMovies, fetchMovieTheatres } from '../services/api';
import { useLocationStore } from '../store/locationStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Clock, Calendar, Star, ChevronDown, ChevronUp, Play, SlidersHorizontal } from 'lucide-react';

export default function MoviesPage() {
    const { location } = useLocationStore();
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [search, setSearch] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState('');
    
    // Expanded movie
    const [expandedMovieId, setExpandedMovieId] = useState(null);
    const [theatres, setTheatres] = useState([]);
    const [theatresLoading, setTheatresLoading] = useState(false);

    useEffect(() => {
        const loadMovies = async () => {
            setLoading(true);
            try {
                const data = await fetchMovies(location);
                setMovies(data);
                setExpandedMovieId(null);
            } catch (error) {
                console.error("Failed to load movies:", error);
            } finally {
                setLoading(false);
            }
        };
        loadMovies();
    }, [location]);

    const handleExpand = async (movieId) => {
        if (expandedMovieId === movieId) {
            setExpandedMovieId(null);
            return;
        }
        setExpandedMovieId(movieId);
        setTheatresLoading(true);
        try {
            const data = await fetchMovieTheatres(movieId);
            setTheatres(data.filter(t => t.city === location || t.state === location));
        } catch (error) {
            console.error(error);
        } finally {
            setTheatresLoading(false);
        }
    };

    const genres = [...new Set(movies.map(m => m.genre))];
    const languages = [...new Set(movies.map(m => m.language))];

    const filteredMovies = movies.filter(m => {
        const matchesSearch = m.title.toLowerCase().includes(search.toLowerCase());
        const matchesGenre = selectedGenre ? m.genre === selectedGenre : true;
        const matchesLang = selectedLanguage ? m.language === selectedLanguage : true;
        return matchesSearch && matchesGenre && matchesLang;
    });

    return (
        <div className="min-h-screen bg-[#0B0F1A] text-white">
            <Header />
            
            <ElegantHero 
                title="Cinematic Pulse"
                subtitle={`Discovery in ${location}`}
                bgImage="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop"
            />

            <main className="max-w-[1600px] mx-auto px-6 md:px-12 pb-32 -mt-20 relative z-30">
                
                {/* Filter Bar */}
                <div className="glass-card rounded-3xl p-4 md:p-6 mb-16 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex flex-wrap items-center gap-4">
                        <select 
                            value={selectedLanguage} 
                            onChange={(e) => setSelectedLanguage(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-full py-3 px-8 text-[10px] font-black uppercase tracking-widest outline-none appearance-none hover:bg-white/10 transition-colors"
                        >
                            <option value="" className="bg-[#111827]">All Languages</option>
                            {languages.map(l => <option key={l} value={l} className="bg-[#111827]">{l}</option>)}
                        </select>

                        <select 
                            value={selectedGenre} 
                            onChange={(e) => setSelectedGenre(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-full py-3 px-8 text-[10px] font-black uppercase tracking-widest outline-none appearance-none hover:bg-white/10 transition-colors"
                        >
                            <option value="" className="bg-[#111827]">All Genres</option>
                            {genres.map(g => <option key={g} value={g} className="bg-[#111827]">{g}</option>)}
                        </select>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative flex-grow md:w-80">
                            <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40" />
                            <input 
                                type="text"
                                placeholder="Search the reels..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-14 pr-6 text-xs font-bold outline-none focus:border-[#E31B23]/50 focus:bg-white/10 transition-all uppercase tracking-widest"
                            />
                        </div>
                        <button className="p-4 bg-white/5 rounded-full hover:bg-[#E31B23] transition-colors group">
                            <SlidersHorizontal size={18} className="text-white group-hover:scale-110 transition-transform" />
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="h-96 flex flex-col items-center justify-center gap-6">
                        <div className="w-16 h-16 border-4 border-[#E31B23] border-t-transparent rounded-full animate-spin shadow-2xl shadow-[#E31B23]/20" />
                        <span className="text-[10px] font-black tracking-[0.5em] uppercase text-[#E31B23] animate-pulse">Scanning Reels...</span>
                    </div>
                ) : filteredMovies.length === 0 ? (
                    <div className="h-96 flex flex-col items-center justify-center text-center">
                        <h2 className="text-elegant text-4xl mb-4 opacity-30 italic">No Reels Found</h2>
                        <p className="text-white/40 text-xs font-bold uppercase tracking-[0.3em]">Cinemas are silent in {location}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-10">
                        {filteredMovies.map((movie) => (
                            <React.Fragment key={movie.id}>
                                <ElegantCard 
                                    item={movie} 
                                    onClick={() => handleExpand(movie.id)}
                                />

                                {/* Expanded Theatre Section */}
                                <AnimatePresence>
                                    {expandedMovieId === movie.id && (
                                        <motion.div 
                                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                            animate={{ opacity: 1, height: 'auto', marginTop: 24, marginBottom: 24 }}
                                            exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0 }}
                                            className="w-full bg-white/5 backdrop-blur-3xl rounded-[40px] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden col-span-1 md:col-span-2 lg:col-span-4 xl:col-span-5"
                                            style={{ gridColumn: '1 / -1' }}
                                        >
                                            <div className="p-10 md:p-16">
                                                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-10 border-b border-white/5">
                                                    <div>
                                                        <h4 className="text-elegant text-5xl md:text-7xl font-black italic uppercase text-white tracking-tighter mb-4">{movie.title}</h4>
                                                        <div className="flex items-center gap-4">
                                                            <span className="px-5 py-2 bg-[#E31B23] text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-[#E31B23]/30">{movie.genre}</span>
                                                            <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] ml-4">{movie.duration} Mins • {movie.language}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {theatresLoading ? (
                                                    <div className="h-48 flex items-center justify-center">
                                                        <div className="w-12 h-12 border-4 border-[#E31B23] border-t-transparent rounded-full animate-spin" />
                                                    </div>
                                                ) : theatres.length === 0 ? (
                                                    <div className="py-20 text-center text-white/20 text-sm font-black tracking-[0.5em] uppercase bg-white/2 rounded-[30px] border border-white/5">
                                                        Curtain closed in <span className="text-[#E31B23]">{location}</span>.
                                                    </div>
                                                ) : (
                                                    <div className="grid grid-cols-1 gap-8">
                                                        {theatres.map(theatre => (
                                                            <div key={theatre.theatreId} className="flex flex-col md:flex-row md:items-center justify-between p-8 md:p-10 bg-white/5 rounded-[30px] border border-white/5 hover:bg-white/10 transition-all group">
                                                                <div className="mb-8 md:mb-0">
                                                                    <h5 className="text-elegant text-2xl font-black italic uppercase tracking-tight mb-2 group-hover:text-[#E31B23] transition-colors">{theatre.theatreName}</h5>
                                                                    <div className="flex items-center gap-2 text-white/40 text-[10px] font-bold uppercase tracking-widest">
                                                                        <MapPin size={12} className="text-[#E31B23]" />
                                                                        <span>{theatre.address}</span>
                                                                    </div>
                                                                </div>
                                                                
                                                                <div className="flex flex-wrap items-center gap-4">
                                                                    {theatre.shows.map(show => {
                                                                        const showTime = new Date(show.showTime);
                                                                        return (
                                                                            <button 
                                                                                key={show.showId}
                                                                                className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl text-[10px] font-black tracking-[0.2em] hover:bg-[#E31B23] hover:border-[#E31B23] transition-all hover:scale-105 active:scale-95 shadow-xl"
                                                                            >
                                                                                {showTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                            </button>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </React.Fragment>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
