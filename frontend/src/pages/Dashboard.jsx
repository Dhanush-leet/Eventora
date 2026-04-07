import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
    Ticket, LogOut, User, Calendar, MapPin, ArrowRight,
    AlertCircle, CheckCircle2, XCircle, Clock
} from 'lucide-react';
import { fetchMyBookings } from '../services/api';
import { useAuthStore } from '../store/authStore';
import Header from '../components/common/Header';

const statusConfig = {
    CONFIRMED: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30', label: 'Confirmed' },
    PENDING:   { icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30', label: 'Pending Payment' },
    CANCELLED: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30', label: 'Cancelled' },
    REFUNDED:  { icon: AlertCircle, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30', label: 'Refunded' },
};

function BookingCard({ booking, index }) {
    const navigate = useNavigate();
    const status = statusConfig[booking.status] || statusConfig.PENDING;
    const Icon = status.icon;
    const fmt = new Date(booking.eventDate).toLocaleDateString('en-IN', {
        weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-[#111827] border border-white/5 rounded-2xl overflow-hidden hover:border-white/15 transition-colors cursor-pointer"
            onClick={() => navigate(`/booking/${booking.id}/confirmation`)}
        >
            <div className="flex gap-0">
                {/* Banner thumbnail */}
                <div className="w-28 shrink-0 relative">
                    <img src={booking.bannerImageUrl} alt={booking.eventTitle}
                        className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#111827]/80" />
                </div>

                {/* Info */}
                <div className="flex-1 p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-bold text-white text-sm line-clamp-2 leading-snug">{booking.eventTitle}</h3>
                        <span className={`shrink-0 flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold border ${status.bg} ${status.color}`}>
                            <Icon size={12} /> {status.label}
                        </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-white/40 mb-3">
                        <span className="flex items-center gap-1"><Calendar size={11} />{fmt}</span>
                        <span className="flex items-center gap-1"><MapPin size={11} />{booking.eventCity}</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex gap-1.5 flex-wrap">
                            {booking.seatNumbers?.slice(0, 4).map(s => (
                                <span key={s} className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded text-xs border border-purple-500/20">
                                    {s}
                                </span>
                            ))}
                            {booking.seatNumbers?.length > 4 && (
                                <span className="px-2 py-0.5 bg-white/5 text-white/40 rounded text-xs">
                                    +{booking.seatNumbers.length - 4} more
                                </span>
                            )}
                        </div>
                        <p className="text-white font-bold text-sm shrink-0">
                            ₹{Number(booking.totalPrice).toLocaleString('en-IN')}
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default function Dashboard() {
    const { user, isLoggedIn, isLoading: authLoading, loadUser, logout } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        loadUser();
    }, []);

    useEffect(() => {
        if (!authLoading && !isLoggedIn) {
            navigate('/');
        }
    }, [authLoading, isLoggedIn]);

    const { data: bookings = [], isLoading: bookingsLoading } = useQuery({
        queryKey: ['my-bookings'],
        queryFn: fetchMyBookings,
        enabled: isLoggedIn,
    });

    if (authLoading) return (
        <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center">
            <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    const confirmedCount = bookings.filter(b => b.status === 'CONFIRMED').length;
    const totalSpent = bookings.filter(b => b.status === 'CONFIRMED')
        .reduce((sum, b) => sum + Number(b.totalPrice), 0);

    return (
        <div className="min-h-screen bg-[#0B0F1A] text-white">
            <Header />

            <div className="max-w-5xl mx-auto px-4 md:px-8 py-28">
                {/* User profile header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between mb-10"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-2xl font-black">
                            {user?.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div>
                            <p className="text-white/40 text-sm">Welcome back</p>
                            <h1 className="text-2xl font-black text-white">{user?.name || 'Loading...'}</h1>
                            <p className="text-white/40 text-sm">{user?.email}</p>
                        </div>
                    </div>
                    <button onClick={logout}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 rounded-xl text-white/60 hover:text-red-400 transition-all text-sm font-medium">
                        <LogOut size={16} /> Logout
                    </button>
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
                    {[
                        { label: 'Total Bookings', value: bookings.length, color: 'text-purple-400' },
                        { label: 'Confirmed Tickets', value: confirmedCount, color: 'text-emerald-400' },
                        { label: 'Total Spent', value: `₹${totalSpent.toLocaleString('en-IN')}`, color: 'text-amber-400' },
                    ].map(({ label, value, color }) => (
                        <motion.div
                            key={label}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-[#111827] border border-white/5 rounded-2xl p-5"
                        >
                            <p className="text-white/40 text-sm mb-1">{label}</p>
                            <p className={`text-3xl font-black ${color}`}>{value}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Bookings */}
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-xl font-black text-white">My Bookings</h2>
                    <Link to="/events"
                        className="flex items-center gap-1 text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors">
                        Explore Events <ArrowRight size={16} />
                    </Link>
                </div>

                {bookingsLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-24 bg-[#111827] border border-white/5 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="text-center py-20 bg-[#111827] border border-white/5 rounded-3xl">
                        <Ticket size={48} className="text-white/20 mx-auto mb-4" />
                        <p className="text-white/50 text-xl font-bold mb-2">No bookings yet</p>
                        <p className="text-white/30 mb-6">Discover amazing events and book your first ticket</p>
                        <Link to="/events"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold">
                            Browse Events <ArrowRight size={18} />
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {bookings.map((booking, i) => (
                            <BookingCard key={booking.id} booking={booking} index={i} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
