import React, { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import { fetchMovies, fetchMovieTheatres } from '../services/api';
import { useLocationStore } from '../store/locationStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Clock, Calendar, Star, ChevonDown, ChevronUp, Play } from 'lucide-react';

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
            // Also filter theatres to match the selected location (if needed, though backend should ideally return all or local)
            setTheatres(data.filter(t => t.city === location || t.state === location));
        } catch (error) {
            console.error(error);
        } finally {
            setTheatresLoading(false);
        }
    };

    // Extract unique genres and languages for filters
    const genres = [...new Set(movies.map(m => m.genre))];
    const languages = [...new Set(movies.map(m => m.language))];

    // Apply filters
    const filteredMovies = movies.filter(m => {
        const matchesSearch = m.title.toLowerCase().includes(search.toLowerCase());
        const matchesGenre = selectedGenre ? m.genre === selectedGenre : true;
        const matchesLang = selectedLanguage ? m.language === selectedLanguage : true;
        return matchesSearch && matchesGenre && matchesLang;
    });

    return (
        <div className="min-h-screen bg-[#0B0F1A] text-white">
            <Header />
            <main className="pt-28 pb-32 max-w-7xl mx-auto px-6">
                
                {/* Header & Filters */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-8">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase mb-2">Movies in <span className="text-[#E31B23]">{location}</span></h1>
                        <p className="text-white/50 text-xs tracking-widest uppercase font-bold">Discover the ultimate cinematic pulse</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <div className="relative">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                            <input 
                                type="text"
                                placeholder="Search movies..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-6 text-sm outline-none focus:border-[#E31B23] transition-colors"
                            />
                        </div>
                        
                        <select 
                            value={selectedLanguage} 
                            onChange={(e) => setSelectedLanguage(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-full py-3 px-6 text-sm outline-none appearance-none"
                        >
                            <option value="" className="bg-[#111827]">All Languages</option>
                            {languages.map(l => <option key={l} value={l} className="bg-[#111827]">{l}</option>)}
                        </select>

                        <select 
                            value={selectedGenre} 
                            onChange={(e) => setSelectedGenre(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-full py-3 px-6 text-sm outline-none appearance-none"
                        >
                            <option value="" className="bg-[#111827]">All Genres</option>
                            {genres.map(g => <option key={g} value={g} className="bg-[#111827]">{g}</option>)}
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-32 text-[#E31B23]">
                        <div className="w-12 h-12 border-4 border-[#E31B23] border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : filteredMovies.length === 0 ? (
                    <div className="text-center py-32 text-white/50 text-xl font-bold tracking-widest uppercase">
                        No movies found for {location}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {filteredMovies.map((movie) => (
                            <React.Fragment key={movie.id}>
                                <div className="relative group flex flex-col">
                                    <motion.div 
                                        className={`relative overflow-hidden rounded-2xl aspect-[2/3] cursor-pointer shadow-2xl transition-all duration-500 ${expandedMovieId === movie.id ? 'ring-2 ring-[#E31B23] scale-[1.02]' : 'hover:scale-105'}`}
                                        onClick={() => handleExpand(movie.id)}
                                        layoutId={`movie-${movie.id}`}
                                    >
                                        <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                                        
                                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5">
                                            <Star size={12} className="text-[#E31B23] fill-[#E31B23]" />
                                            <span className="text-xs font-black">{movie.rating}</span>
                                        </div>
                                        
                                        <div className="absolute bottom-6 left-6 right-6">
                                            <h3 className="text-2xl font-black italic tracking-tight uppercase leading-none mb-2">{movie.title}</h3>
                                            <div className="flex items-center gap-3 text-[10px] font-black uppercase text-white/60 tracking-widest">
                                                <span>{movie.language}</span>
                                                <span>•</span>
                                                <span className="truncate">{movie.genre}</span>
                                            </div>
                                        </div>

                                        {/* Play icon overlay */}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <div className="w-16 h-16 rounded-full bg-[#E31B23]/90 flex items-center justify-center backdrop-blur-sm shadow-2xl shadow-[#E31B23]/40">
                                                <Play size={24} className="text-white fill-white ml-2" />
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Expanded Theatre Section */}
                                <AnimatePresence>
                                    {expandedMovieId === movie.id && (
                                        <motion.div 
                                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                            animate={{ opacity: 1, height: 'auto', marginTop: 24, marginBottom: 24 }}
                                            exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0 }}
                                            className="w-full bg-[#111827] rounded-3xl border border-white/10 shadow-2xl overflow-hidden col-span-1 md:col-span-2 lg:col-span-4 overflow-hidden"
                                            style={{ gridColumn: '1 / -1' }} // span full width of the grid!
                                        >
                                            <div className="p-8 md:p-12">
                                                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-8 border-b border-white/5">
                                                    <div>
                                                        <h4 className="text-4xl font-black italic uppercase text-white tracking-tighter mb-2">{movie.title}</h4>
                                                        <div className="flex items-center gap-3">
                                                            <span className="px-3 py-1 bg-[#E31B23]/20 text-[#E31B23] rounded-md text-[10px] font-black uppercase tracking-widest">{movie.genre}</span>
                                                            <span className="text-white/40 text-xs font-bold uppercase tracking-widest">{movie.duration} Mins</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {theatresLoading ? (
                                                    <div className="h-32 flex items-center justify-center">
                                                        <div className="w-10 h-10 border-4 border-[#E31B23] border-t-transparent rounded-full animate-spin" />
                                                    </div>
                                                ) : theatres.length === 0 ? (
                                                    <div className="py-12 text-center text-white/30 text-sm font-bold tracking-widest uppercase bg-white/5 rounded-2xl border border-white/5">
                                                        No shows available in <span className="text-white/80">{location}</span> currently.
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col gap-6">
                                                        {theatres.map(theatre => (
                                                            <div key={theatre.theatreId} className="flex flex-col md:flex-row md:items-stretch gap-0 bg-white/5 rounded-2xl border border-white/5 hover:border-white/20 transition-all overflow-hidden group">
                                                                <div className="md:w-1/3 bg-black/20 p-6 md:p-8 flex flex-col justify-center border-b md:border-b-0 md:border-r border-white/5">
                                                                    <h5 className="font-black text-xl uppercase tracking-tighter mb-3 group-hover:text-[#E31B23] transition-colors">{theatre.theatreName}</h5>
                                                                    <div className="flex items-start gap-2 text-white/50 text-xs leading-relaxed max-w-[250px]">
                                                                        <MapPin size={14} className="flex-shrink-0 mt-0.5 text-[#E31B23]" />
                                                                        <span>{theatre.address}, {theatre.city}</span>
                                                                    </div>
                                                                </div>
                                                                
                                                                <div className="flex flex-wrap items-center gap-4 p-6 md:p-8 md:w-2/3 bg-black/10">
                                                                    {theatre.shows.map(show => {
                                                                        const showTime = new Date(show.showTime);
                                                                        return (
                                                                            <button 
                                                                                key={show.showId}
                                                                                className="px-6 py-3 bg-transparent border border-[#00C853]/40 text-[#00C853] rounded-xl text-xs font-black tracking-[0.2em] hover:bg-[#00C853] hover:text-black hover:border-[#00C853] transition-all hover:scale-105 shadow-lg shadow-[#00C853]/10"
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
