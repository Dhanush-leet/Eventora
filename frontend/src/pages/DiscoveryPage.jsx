import React, { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import ElegantHero from '../components/discovery/ElegantHero';
import ElegantCard from '../components/discovery/ElegantCard';
import { fetchEvents } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { useLocationStore } from '../store/locationStore';

const DiscoveryPage = ({ type = 'events' }) => {
  const { location } = useLocationStore();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const configs = {
    events: {
      title: "Discover Events",
      subtitle: "The Pulse of Culture",
      bg: "https://images.unsplash.com/photo-1514525253361-bee243870d24?q=80&w=2070&auto=format&fit=crop",
      categories: ["All", "Concert", "Workshop", "Conference", "Meetup"]
    },
    stream: {
      title: "Premium Streams",
      subtitle: "Cinematic Experience at Home",
      bg: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop",
      categories: ["All", "Movie", "Live", "Theatre", "Indie"]
    },
    plays: {
      title: "Grand Plays",
      subtitle: "The Soul of Performance",
      bg: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=2069&auto=format&fit=crop",
      categories: ["All", "Drama", "Comedy", "Musical", "Classic"]
    },
    sports: {
      title: "Live Sports",
      subtitle: "The Arena of Legends",
      bg: "https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=2069&auto=format&fit=crop",
      categories: ["All", "Cricket", "Football", "Tennis", "Esports"]
    }
  };

  const currentConfig = configs[type] || configs.events;

  useEffect(() => {
    const loadItems = async () => {
      setLoading(true);
      try {
        // In a real app, we'd pass the type to the API
        const data = await fetchEvents({ 
          location, 
          category: selectedCategory === 'All' ? '' : selectedCategory 
        });
        
        // Filter by type if needed (assuming 'type' maps to some property)
        // For now, we use the returned data from fetchEvents as a generic discovery source
        setItems(data.content || data);
      } catch (error) {
        console.error(`Failed to load ${type}:`, error);
      } finally {
        setLoading(false);
      }
    };
    loadItems();
  }, [location, selectedCategory, type]);

  const filteredItems = items.filter(item => 
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white selection:bg-[#E31B23]">
      <Header />
      
      <ElegantHero 
        title={currentConfig.title}
        subtitle={currentConfig.subtitle}
        bgImage={currentConfig.bg}
      />

      <main className="max-w-[1600px] mx-auto px-6 md:px-12 pb-32 -mt-20 relative z-30">
        {/* Filter Bar */}
        <div className="glass-card rounded-3xl p-4 md:p-6 mb-16 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-4">
            {currentConfig.categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                  selectedCategory === cat 
                    ? 'bg-[#E31B23] text-white shadow-lg shadow-[#E31B23]/40' 
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-grow md:w-80">
              <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40" />
              <input 
                type="text"
                placeholder={`Search ${type}...`}
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

        {/* Content Grid */}
        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center gap-6">
            <div className="w-16 h-16 border-4 border-[#E31B23] border-t-transparent rounded-full animate-spin shadow-2xl shadow-[#E31B23]/20" />
            <span className="text-[10px] font-black tracking-[0.5em] uppercase text-[#E31B23] animate-pulse">Syncing Pulse...</span>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="h-96 flex flex-col items-center justify-center text-center">
            <h2 className="text-elegant text-4xl mb-4 opacity-30 italic">Silence in the Hall</h2>
            <p className="text-white/40 text-xs font-bold uppercase tracking-[0.3em]">No {type} found in {location}</p>
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-10 stagger-load"
          >
            <AnimatePresence>
              {filteredItems.map(item => (
                <ElegantCard 
                  key={item.id} 
                  item={item} 
                  onClick={() => window.location.href = `/events/${item.id}`}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Pagination / Load More */}
        {!loading && filteredItems.length > 0 && (
          <div className="mt-24 flex justify-center">
            <button className="group flex items-center gap-6 px-12 py-6 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all hover:scale-105">
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Load More Discoveries</span>
              <div className="w-10 h-10 rounded-full bg-[#E31B23] flex items-center justify-center group-hover:translate-x-2 transition-transform">
                <ArrowRight size={16} />
              </div>
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default DiscoveryPage;
