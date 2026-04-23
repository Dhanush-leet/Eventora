import React from 'react';
import { motion } from 'framer-motion';
import { Star, Play, Calendar, MapPin } from 'lucide-react';

const ElegantCard = ({ item, onClick }) => {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      onClick={onClick}
      className="group relative cursor-pointer"
    >
      <div className="relative aspect-[2/3] rounded-2xl overflow-hidden glass-card">
        <img 
          src={item.posterUrl || item.imageUrl || `https://picsum.photos/seed/${item.id}/600/900`} 
          alt={item.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F1A] via-transparent to-transparent opacity-80" />
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="w-16 h-16 rounded-full bg-[#E31B23]/90 flex items-center justify-center backdrop-blur-md shadow-2xl scale-0 group-hover:scale-100 transition-transform duration-500 delay-100">
            <Play size={24} className="text-white fill-white ml-1" />
          </div>
        </div>

        {/* Rating Badge */}
        {item.rating && (
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/10">
            <Star size={12} className="text-[#E31B23] fill-[#E31B23]" />
            <span className="text-[10px] font-black">{item.rating}</span>
          </div>
        )}

        {/* Info Overlay */}
        <div className="absolute bottom-6 left-6 right-6">
          <motion.h3 className="text-2xl font-black italic tracking-tighter uppercase leading-none mb-3 group-hover:text-[#E31B23] transition-colors">
            {item.title}
          </motion.h3>
          <div className="flex flex-wrap items-center gap-3 text-[9px] font-black uppercase text-white/50 tracking-widest">
            {item.language && <span>{item.language}</span>}
            {item.genre && (
              <>
                <span className="w-1 h-1 rounded-full bg-[#E31B23]" />
                <span>{item.genre}</span>
              </>
            )}
            {item.category && (
               <>
               <span className="w-1 h-1 rounded-full bg-[#E31B23]" />
               <span>{item.category}</span>
             </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ElegantCard;
