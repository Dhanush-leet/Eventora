import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, Ticket, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { fetchSeats, lockSeats, unlockSeats, createBooking } from '../services/api';
import { fetchEventById } from '../services/api';
import { useAuthStore } from '../store/authStore';
import Header from '../components/common/Header';

const TIER_STYLES = {
    STANDARD: { color: 'bg-slate-500/80 hover:bg-slate-400 border-slate-400/50', label: 'Standard', textColor: 'text-slate-200' },
    PREMIUM:  { color: 'bg-blue-600/80 hover:bg-blue-500 border-blue-400/50', label: 'Premium', textColor: 'text-blue-200' },
    VIP:      { color: 'bg-purple-600/80 hover:bg-purple-500 border-purple-400/50', label: 'VIP', textColor: 'text-purple-200' },
    PRESTIGE: { color: 'bg-amber-600/80 hover:bg-amber-500 border-amber-400/50', label: 'Prestige', textColor: 'text-amber-200' },
};

const LOCK_DURATION = 5 * 60; // 5 minutes in seconds

function SeatSelectionPage() {
    const { id: eventId } = useParams();
    const navigate = useNavigate();
    const { isLoggedIn } = useAuthStore();

    const [selectedIds, setSelectedIds] = useState([]);
    const [lockedIds, setLockedIds] = useState([]);
    const [lockTimer, setLockTimer] = useState(null);
    const [secondsLeft, setSecondsLeft] = useState(0);
    const [step, setStep] = useState('select'); // select | confirm
    const [error, setError] = useState('');

    const { data: event } = useQuery({ queryKey: ['event', eventId], queryFn: () => fetchEventById(eventId) });
    const { data: seats = [], refetch: refetchSeats } = useQuery({
        queryKey: ['seats', eventId],
        queryFn: () => fetchSeats(eventId),
        refetchInterval: 10000, // poll every 10s for real-time updates
    });

    const lockMutation = useMutation({
        mutationFn: (seatIds) => lockSeats(eventId, seatIds),
        onSuccess: (data) => {
            setLockedIds(selectedIds);
            setSecondsLeft(LOCK_DURATION);
            setStep('confirm');
            setError('');
        },
        onError: (err) => {
            setError(err.response?.data?.error || 'Failed to lock seats. Try again.');
        }
    });

    const bookingMutation = useMutation({
        mutationFn: () => createBooking(eventId, lockedIds),
        onSuccess: (booking) => {
            navigate(`/booking/${booking.id}/confirmation`);
        },
        onError: (err) => {
            setError(err.response?.data?.error || 'Booking failed. Please try again.');
        }
    });

    // Countdown timer
    useEffect(() => {
        if (step !== 'confirm' || secondsLeft <= 0) return;
        const interval = setInterval(() => {
            setSecondsLeft(s => {
                if (s <= 1) {
                    clearInterval(interval);
                    // Lock expired, go back to selection
                    setStep('select');
                    setLockedIds([]);
                    setSelectedIds([]);
                    setError('Your seat lock expired. Please reselect.');
                    refetchSeats();
                    return 0;
                }
                return s - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [step, secondsLeft]);

    const toggleSeat = useCallback((seat) => {
        if (seat.status === 'BOOKED' || seat.status === 'BLOCKED') return;
        if (seat.status === 'LOCKED' && !seat.lockedByCurrentUser) return;
        if (step === 'confirm') return;

        setSelectedIds(prev =>
            prev.includes(seat.id)
                ? prev.filter(id => id !== seat.id)
                : prev.length < 10 ? [...prev, seat.id] : prev
        );
    }, [step]);

    const handleLockSeats = () => {
        if (!isLoggedIn) {
            setError('Please log in to book seats');
            return;
        }
        if (selectedIds.length === 0) {
            setError('Please select at least one seat');
            return;
        }
        lockMutation.mutate(selectedIds);
    };

    const handleCancelLock = async () => {
        try {
            await unlockSeats(eventId, lockedIds);
        } catch {}
        setStep('select');
        setLockedIds([]);
        setSelectedIds([]);
        setSecondsLeft(0);
        refetchSeats();
    };

    // Group seats by row
    const seatsByRow = seats.reduce((acc, seat) => {
        if (!acc[seat.rowNumber]) acc[seat.rowNumber] = [];
        acc[seat.rowNumber].push(seat);
        return acc;
    }, {});

    const selectedSeats = seats.filter(s => selectedIds.includes(s.id));
    const totalPrice = selectedSeats.reduce((sum, s) => sum + Number(s.finalPrice), 0);
    const tiersInEvent = [...new Set(seats.map(s => s.tier))];

    const getCountdown = () => {
        const m = Math.floor(secondsLeft / 60);
        const s = secondsLeft % 60;
        return `${m}:${String(s).padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen bg-[#0B0F1A] text-white">
            <Header />
            <div className="pt-20 max-w-6xl mx-auto px-4 md:px-8 pb-20">

                {/* Back + title */}
                <div className="flex items-center gap-4 py-6 mb-2">
                    <button onClick={() => navigate(`/events/${eventId}`)}
                        className="text-white/50 hover:text-white transition-colors flex items-center gap-2 text-sm">
                        <ArrowLeft size={16} /> Back
                    </button>
                    <div>
                        <h1 className="text-xl font-black text-white">{event?.title}</h1>
                        <p className="text-white/40 text-sm">{event?.venue}, {event?.city}</p>
                    </div>
                </div>

                {/* Lock timer banner */}
                <AnimatePresence>
                    {step === 'confirm' && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className={`flex items-center justify-between p-4 rounded-2xl mb-6 border ${secondsLeft < 60 ? 'bg-red-500/20 border-red-500/40' : 'bg-amber-500/10 border-amber-500/30'}`}
                        >
                            <div className="flex items-center gap-3">
                                <Clock size={20} className={secondsLeft < 60 ? 'text-red-400' : 'text-amber-400'} />
                                <div>
                                    <p className="font-bold text-white">Seats locked!</p>
                                    <p className="text-white/50 text-sm">Complete payment before time runs out</p>
                                </div>
                            </div>
                            <div className={`text-3xl font-black tabular-nums ${secondsLeft < 60 ? 'text-red-400' : 'text-amber-400'}`}>
                                {getCountdown()}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Error */}
                <AnimatePresence>
                    {error && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-2xl mb-6">
                            <AlertCircle size={18} />
                            {error}
                            <button onClick={() => setError('')} className="ml-auto"><X size={16} /></button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Seat map */}
                    <div className="lg:col-span-2">
                        {/* Stage */}
                        <div className="mb-8 text-center">
                            <div className="inline-block w-2/3 py-2 bg-white/10 rounded-xl text-white/40 text-sm font-semibold tracking-widest uppercase mb-2">
                                STAGE / SCREEN
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="flex flex-wrap gap-3 mb-6 justify-center">
                            {tiersInEvent.map(tier => (
                                <div key={tier} className="flex items-center gap-2 text-xs">
                                    <div className={`w-4 h-4 rounded ${TIER_STYLES[tier]?.color.split(' ')[0] || 'bg-slate-500'}`} />
                                    <span className="text-white/60">{TIER_STYLES[tier]?.label || tier}</span>
                                </div>
                            ))}
                            <div className="flex items-center gap-2 text-xs">
                                <div className="w-4 h-4 rounded bg-white/10" />
                                <span className="text-white/60">Unavailable</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                                <div className="w-4 h-4 rounded bg-emerald-500" />
                                <span className="text-white/60">Selected</span>
                            </div>
                        </div>

                        {/* Seat grid */}
                        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                            {Object.entries(seatsByRow).map(([row, rowSeats]) => (
                                <div key={row} className="flex items-center gap-2">
                                    <span className="text-white/30 text-xs w-8 text-right shrink-0">{row}</span>
                                    <div className="flex gap-1.5 flex-wrap">
                                        {rowSeats.map(seat => {
                                            const isSelected = selectedIds.includes(seat.id);
                                            const isBooked = seat.status === 'BOOKED' || seat.status === 'BLOCKED';
                                            const isLocked = seat.status === 'LOCKED' && !seat.lockedByCurrentUser;
                                            const style = TIER_STYLES[seat.tier] || TIER_STYLES.STANDARD;

                                            return (
                                                <motion.button
                                                    key={seat.id}
                                                    whileHover={!isBooked && !isLocked && step !== 'confirm' ? { scale: 1.1 } : {}}
                                                    whileTap={!isBooked && !isLocked && step !== 'confirm' ? { scale: 0.9 } : {}}
                                                    onClick={() => toggleSeat(seat)}
                                                    disabled={isBooked || isLocked || step === 'confirm'}
                                                    title={`${seat.seatNumber} - ${seat.tier} - ₹${Math.round(seat.finalPrice)}`}
                                                    className={`w-7 h-7 rounded-lg text-[9px] font-bold border transition-all duration-150
                                                        ${isBooked ? 'bg-red-900/40 border-red-900/30 cursor-not-allowed opacity-40' :
                                                          isLocked ? 'bg-orange-900/40 border-orange-900/30 cursor-not-allowed opacity-50' :
                                                          isSelected ? 'bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-500/30' :
                                                          `${style.color} border cursor-pointer text-white/70`}
                                                    `}
                                                >
                                                    {seat.columnNumber}
                                                </motion.button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Summary panel */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 bg-[#111827] border border-white/10 rounded-3xl p-6">
                            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <Ticket size={18} className="text-purple-400" /> Your Selection
                            </h2>

                            {selectedIds.length === 0 ? (
                                <p className="text-white/30 text-sm text-center py-8">
                                    Click seats on the map to select
                                </p>
                            ) : (
                                <div className="space-y-3 mb-6">
                                    {selectedSeats.map(seat => (
                                        <div key={seat.id} className="flex items-center justify-between text-sm">
                                            <div>
                                                <p className="text-white font-semibold">{seat.seatNumber}</p>
                                                <p className={`text-xs ${TIER_STYLES[seat.tier]?.textColor || 'text-white/50'}`}>{seat.tier}</p>
                                            </div>
                                            <p className="text-white font-bold">₹{Math.round(seat.finalPrice).toLocaleString('en-IN')}</p>
                                        </div>
                                    ))}
                                    <div className="border-t border-white/10 pt-3 flex justify-between font-black">
                                        <span>Total</span>
                                        <span className="text-purple-400">₹{Math.round(totalPrice).toLocaleString('en-IN')}</span>
                                    </div>
                                </div>
                            )}

                            {step === 'select' ? (
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleLockSeats}
                                    disabled={selectedIds.length === 0 || lockMutation.isPending}
                                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-2xl font-black transition-all"
                                >
                                    {lockMutation.isPending ? 'Locking...' : `Lock ${selectedIds.length} Seat${selectedIds.length !== 1 ? 's' : ''}`}
                                </motion.button>
                            ) : (
                                <div className="space-y-3">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => bookingMutation.mutate()}
                                        disabled={bookingMutation.isPending}
                                        className="w-full py-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 disabled:opacity-40 text-white rounded-2xl font-black transition-all"
                                    >
                                        {bookingMutation.isPending ? 'Processing...' : '✓ Confirm & Pay'}
                                    </motion.button>
                                    <button onClick={handleCancelLock}
                                        className="w-full py-3 text-red-400 border border-red-500/30 rounded-2xl text-sm hover:bg-red-500/10 transition-colors">
                                        Release Seats
                                    </button>
                                </div>
                            )}

                            <p className="text-center text-white/25 text-xs mt-4">
                                Max 10 seats per booking
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SeatSelectionPage;
