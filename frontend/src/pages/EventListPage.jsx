import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Zap, TrendingUp } from 'lucide-react';

const events = [
    {
        id: 'e1',
        title: 'Coldplay: Music Of The Spheres',
        city: 'Mumbai',
        eventDate: '2026-11-20T19:00:00Z',
        basePrice: 4500,
        popularityPercentile: 95,
        demandScore: 4.8,
        bannerImageUrl: 'https://images.unsplash.com/photo-1540039155732-6761b54cbaca?w=800&auto=format&fit=crop',
    },
    {
        id: 'e2',
        title: 'Ed Sheeran: Mathematics Tour',
        city: 'Bangalore',
        eventDate: '2026-12-05T20:00:00Z',
        basePrice: 3500,
        popularityPercentile: 85,
        demandScore: 3.9,
        bannerImageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop',
    },
    {
        id: 'e3',
        title: 'A.R. Rahman Live',
        city: 'Chennai',
        eventDate: '2026-10-15T18:30:00Z',
        basePrice: 2000,
        popularityPercentile: 99,
        demandScore: 4.9,
        bannerImageUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&auto=format&fit=crop',
    }
];

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const DemandIndicator = ({ demandScore }) => (
    <div className="flex items-center gap-2 mt-2">
        <div className="flex-1 h-1.5 bg-surface rounded-full overflow-hidden">
            <motion.div
                className="h-full bg-accent-tertiary"
                initial={{ width: 0 }}
                animate={{ width: `${(demandScore / 5) * 100}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
            />
        </div>
        <span className="text-xs text-text-muted font-medium">Demand {demandScore.toFixed(1)}/5</span>
    </div>
);

const EventCard = ({ event }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            className="relative rounded-2xl overflow-hidden cursor-pointer bg-surface border border-white/5"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            whileHover={{ y: -8, boxShadow: '0 25px 50px -12px rgba(124, 58, 237, 0.15)' }}
        >
            <div className="relative h-56 overflow-hidden">
                <motion.img
                    src={event.bannerImageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover"
                    animate={{ scale: isHovered ? 1.1 : 1 }}
                    transition={{ duration: 0.5 }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent" />

                {event.popularityPercentile > 80 && (
                    <motion.div
                        className="absolute top-4 right-4 px-3 py-1 bg-accent-secondary rounded-full text-xs font-semibold text-white flex items-center gap-1 shadow-lg"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <Zap size={12} /> Trending
                    </motion.div>
                )}
            </div>

            <div className="p-5">
                <h3 className="font-semibold text-xl text-white mb-3 line-clamp-1">{event.title}</h3>

                <div className="flex items-center gap-4 text-sm text-text-secondary mb-4">
                    <div className="flex items-center gap-1">
                        <MapPin size={16} className="text-accent-tertiary" />
                        <span>{event.city}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock size={16} className="text-accent-tertiary" />
                        <span>{formatDate(event.eventDate)}</span>
                    </div>
                </div>

                <DemandIndicator demandScore={event.demandScore} />

                <div className="mt-5 flex items-center justify-between">
                    <div>
                        <span className="text-xs text-text-muted block mb-1">Starting from</span>
                        <span className="text-lg font-bold text-accent-primary flex items-center gap-1">
                            ₹{event.basePrice.toLocaleString()}
                        </span>
                    </div>
                    <motion.button
                        className="px-5 py-2.5 bg-surfaceAlt border border-white/10 rounded-xl text-white text-sm font-semibold hover:bg-accent-primary hover:border-accent-primary transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Book Now
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default function EventListPage() {
    return (
        <div className="min-h-screen bg-background pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
            <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-surface pb-6">
                <div>
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">Upcoming Events</h1>
                    <p className="text-text-secondary text-lg">Discover the most anticipated experiences</p>
                </div>

                {/* Simple mock filters */}
                <div className="flex gap-3">
                    <select className="bg-surface border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-accent-primary transition-colors">
                        <option>All Cities</option>
                        <option>Mumbai</option>
                        <option>Bangalore</option>
                    </select>
                    <select className="bg-surface border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-accent-primary transition-colors">
                        <option>All Categories</option>
                        <option>Concerts</option>
                        <option>Comedy</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.map((event, i) => (
                    <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        viewport={{ once: true }}
                    >
                        <EventCard event={event} />
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
