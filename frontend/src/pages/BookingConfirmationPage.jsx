import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { CheckCircle2, Calendar, MapPin, Ticket, Download, Home, ArrowRight } from 'lucide-react';
import { fetchBookingById } from '../services/api';

export default function BookingConfirmationPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: booking, isLoading } = useQuery({
        queryKey: ['booking', id],
        queryFn: () => fetchBookingById(id),
    });

    if (isLoading) return (
        <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center">
            <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    const fmt = booking ? new Date(booking.eventDate).toLocaleDateString('en-IN', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    }) : '';

    return (
        <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center px-4 py-12">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, type: 'spring' }}
                className="w-full max-w-lg"
            >
                {/* Success icon */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', bounce: 0.6, delay: 0.2 }}
                        className="inline-flex items-center justify-center w-24 h-24 bg-emerald-500/20 rounded-full mb-6"
                    >
                        <CheckCircle2 size={48} className="text-emerald-400" />
                    </motion.div>
                    <h1 className="text-3xl font-black text-white mb-2">Booking Confirmed!</h1>
                    <p className="text-white/50">Your tickets are secured. Have a great time!</p>
                </div>

                {/* Ticket card */}
                <div className="relative bg-[#111827] border border-white/10 rounded-3xl overflow-hidden">
                    {/* Ticket notch effect */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-10 bg-[#0B0F1A] rounded-r-full -ml-2" />
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-10 bg-[#0B0F1A] rounded-l-full -mr-2" />

                    <div className="p-6">
                        {/* Event info */}
                        <div className="mb-4">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="px-2 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs rounded-lg font-bold uppercase">
                                    CONFIRMED
                                </span>
                                <span className="text-white/40 text-xs">#{booking?.bookingReference}</span>
                            </div>
                            <h2 className="text-xl font-black text-white mb-1">{booking?.eventTitle}</h2>
                            <div className="flex items-center gap-4 text-white/50 text-sm">
                                <span className="flex items-center gap-1"><MapPin size={14} className="text-purple-400" />{booking?.eventVenue}, {booking?.eventCity}</span>
                            </div>
                            <div className="flex items-center gap-1 text-white/50 text-sm mt-1">
                                <Calendar size={14} className="text-purple-400" />
                                <span>{fmt}</span>
                            </div>
                        </div>

                        <div className="border-t border-dashed border-white/10 my-4" />

                        {/* Seats */}
                        <div className="mb-4">
                            <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Your Seats</p>
                            <div className="flex flex-wrap gap-2">
                                {booking?.seatNumbers?.map(seat => (
                                    <span key={seat} className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 text-purple-300 rounded-lg text-sm font-bold">
                                        {seat}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="border-t border-dashed border-white/10 my-4" />

                        {/* Total */}
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/40 text-xs">Total Paid</p>
                                <p className="text-2xl font-black text-white">
                                    ₹{Number(booking?.totalPrice || 0).toLocaleString('en-IN')}
                                </p>
                            </div>
                            <div className="flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 text-amber-400 px-4 py-2 rounded-xl">
                                <Ticket size={16} />
                                <span className="font-bold">{booking?.totalSeats} Ticket{booking?.totalSeats > 1 ? 's' : ''}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-6">
                    <Link to="/dashboard"
                        className="flex-1 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-2xl font-bold text-center transition-colors flex items-center justify-center gap-2 text-sm">
                        <Home size={16} /> My Bookings
                    </Link>
                    <Link to="/events"
                        className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-2xl font-bold text-center transition-all flex items-center justify-center gap-2 text-sm">
                        Explore More <ArrowRight size={16} />
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
