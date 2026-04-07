import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
    MapPin, Clock, Calendar, Tag, Users, Star, ArrowLeft,
    ChevronRight, Music, Zap, TrendingUp
} from 'lucide-react';
import { fetchEventById } from '../services/api';
import Header from '../components/common/Header';

const formatDate = (d) => {
    const date = new Date(d);
    return {
        full: date.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        time: date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };
};

function CountdownTimer({ eventDate }) {
    const [timeLeft, setTimeLeft] = React.useState({});

    React.useEffect(() => {
        const calc = () => {
            const diff = new Date(eventDate) - new Date();
            if (diff <= 0) return setTimeLeft({ expired: true });
            setTimeLeft({
                days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((diff % (1000 * 60)) / 1000),
            });
        };
        calc();
        const timer = setInterval(calc, 1000);
        return () => clearInterval(timer);
    }, [eventDate]);

    if (timeLeft.expired) return null;

    return (
        <div className="flex gap-4">
            {[['Days', timeLeft.days], ['Hours', timeLeft.hours], ['Mins', timeLeft.minutes], ['Secs', timeLeft.seconds]].map(([label, val]) => (
                <div key={label} className="text-center">
                    <div className="text-2xl font-black text-white bg-white/10 rounded-xl w-14 h-14 flex items-center justify-center tabular-nums">
                        {String(val ?? '00').padStart(2, '0')}
                    </div>
                    <p className="text-white/40 text-xs mt-1">{label}</p>
                </div>
            ))}
        </div>
    );
}

export default function EventDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: event, isLoading, isError } = useQuery({
        queryKey: ['event', id],
        queryFn: () => fetchEventById(id),
    });

    if (isLoading) return (
        <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center">
            <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (isError || !event) return (
        <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center text-white">
            Event not found
        </div>
    );

    const fmt = formatDate(event.eventDate);
    const fillPct = event.fillPercentage || 0;
    const availablePct = 100 - fillPct;

    return (
        <div className="min-h-screen bg-[#0B0F1A] text-white">
            <Header />

            {/* Hero Banner */}
            <div className="relative h-[55vh] min-h-[400px] w-full overflow-hidden">
                <img src={event.bannerImageUrl} alt={event.title}
                    className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F1A] via-[#0B0F1A]/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F1A]/80 to-transparent" />

                <div className="absolute top-6 left-4 md:left-8">
                    <button onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-white/70 hover:text-white bg-black/30 backdrop-blur-sm px-4 py-2 rounded-xl text-sm transition-colors">
                        <ArrowLeft size={16} /> Back
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-32 relative pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left: Event Info */}
                    <div className="lg:col-span-2">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            {/* Category chip */}
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 text-purple-300 rounded-full text-xs font-bold uppercase tracking-wider">
                                    {event.category}
                                </span>
                                {event.genre && (
                                    <span className="px-3 py-1 bg-white/5 border border-white/10 text-white/50 rounded-full text-xs">
                                        {event.genre}
                                    </span>
                                )}
                                {event.language && (
                                    <span className="px-3 py-1 bg-white/5 border border-white/10 text-white/50 rounded-full text-xs">
                                        {event.language}
                                    </span>
                                )}
                            </div>

                            <h1 className="text-3xl md:text-5xl font-black mb-3 leading-tight">{event.title}</h1>

                            {event.artistName && (
                                <p className="text-purple-400 text-lg font-semibold mb-6 flex items-center gap-2">
                                    <Music size={18} /> {event.artistName}
                                </p>
                            )}

                            {/* Countdown */}
                            <div className="mb-8">
                                <p className="text-white/40 text-sm uppercase tracking-wider mb-3">Event starts in</p>
                                <CountdownTimer eventDate={event.eventDate} />
                            </div>

                            {/* Details grid */}
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                {[
                                    { icon: Calendar, label: 'Date', value: fmt.full },
                                    { icon: Clock, label: 'Time', value: fmt.time },
                                    { icon: MapPin, label: 'City', value: event.city },
                                    { icon: Users, label: 'Venue', value: event.venue },
                                ].map(({ icon: Icon, label, value }) => (
                                    <div key={label} className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                        <div className="flex items-center gap-2 text-white/40 text-xs uppercase tracking-wider mb-2">
                                            <Icon size={14} className="text-purple-400" /> {label}
                                        </div>
                                        <p className="text-white font-semibold text-sm">{value}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Description */}
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/5 mb-8">
                                <h2 className="text-lg font-bold mb-3 text-white/90">About This Event</h2>
                                <p className="text-white/60 leading-relaxed">{event.description}</p>
                            </div>

                            {/* Venue address */}
                            {event.venueAddress && (
                                <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                                    <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                                        <MapPin size={18} className="text-purple-400" /> Venue Details
                                    </h2>
                                    <p className="text-white/60">{event.venue}</p>
                                    <p className="text-white/40 text-sm mt-1">{event.venueAddress}</p>
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* Right: Booking card */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="sticky top-24"
                        >
                            <div className="bg-[#111827] border border-white/10 rounded-3xl p-6 shadow-2xl">
                                {/* Demand meter */}
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-white/60 text-sm flex items-center gap-1">
                                            <TrendingUp size={14} className="text-amber-400" /> Demand
                                        </span>
                                        <span className={`text-sm font-bold ${fillPct > 80 ? 'text-red-400' : fillPct > 50 ? 'text-amber-400' : 'text-emerald-400'}`}>
                                            {fillPct > 80 ? '🔥 Very High' : fillPct > 50 ? '⚡ High' : '✅ Available'}
                                        </span>
                                    </div>
                                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                        <motion.div
                                            className={`h-full rounded-full ${fillPct > 80 ? 'bg-red-500' : fillPct > 50 ? 'bg-amber-400' : 'bg-emerald-400'}`}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${fillPct}%` }}
                                            transition={{ duration: 1, ease: 'easeOut' }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-[11px] text-white/30 mt-1">
                                        <span>{event.soldSeats} sold</span>
                                        <span>{event.availableSeats} left</span>
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="mb-6">
                                    <p className="text-white/40 text-xs mb-1">Price starts at</p>
                                    <div className="flex items-baseline gap-2">
                                        <p className="text-4xl font-black text-white">
                                            ₹{Number(event.currentPrice || event.basePrice).toLocaleString('en-IN')}
                                        </p>
                                        {event.currentPrice > event.basePrice && (
                                            <p className="text-white/30 line-through text-lg">
                                                ₹{Number(event.basePrice).toLocaleString('en-IN')}
                                            </p>
                                        )}
                                    </div>
                                    <p className="text-white/30 text-xs mt-0.5">per seat (dynamic pricing)</p>
                                </div>

                                {/* Demand score */}
                                <div className="flex items-center gap-2 mb-6 bg-white/5 rounded-xl p-3">
                                    <Star size={16} className="text-amber-400 fill-amber-400" />
                                    <span className="text-white font-bold">{event.demandScore}/5</span>
                                    <span className="text-white/40 text-sm">demand score</span>
                                </div>

                                {/* Book button */}
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => navigate(`/events/${id}/seats`)}
                                    disabled={event.availableSeats === 0}
                                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-black text-base tracking-wide shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2 transition-all"
                                >
                                    {event.availableSeats === 0 ? 'SOLD OUT' : (
                                        <>Select Seats <ChevronRight size={20} /></>
                                    )}
                                </motion.button>

                                <p className="text-center text-white/30 text-xs mt-4">
                                    Seats held for 5 minutes after selection
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
