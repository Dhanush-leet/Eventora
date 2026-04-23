import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CreditCard, Shield, Zap, CheckCircle2, XCircle,
    AlertCircle, ArrowLeft, Lock, Loader2, QrCode
} from 'lucide-react';
import Header from '../components/common/Header';
import { createPaymentOrder, verifyPayment, fetchBookingById, verifyManualPayment } from '../services/api';

// ─── Load Razorpay script lazily ────────────────────────────────────────────
const loadRazorpayScript = () =>
    new Promise((resolve) => {
        if (window.Razorpay) { resolve(true); return; }
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload  = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });

// ─── Status Badge ────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
    const configs = {
        CONFIRMED: { label: 'Confirmed',  color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
        PENDING:   { label: 'Pending',    color: 'bg-amber-500/20  text-amber-400  border-amber-500/30'  },
        CANCELLED: { label: 'Cancelled',  color: 'bg-red-500/20    text-red-400    border-red-500/30'    },
        FAILED:    { label: 'Failed',     color: 'bg-red-500/20    text-red-400    border-red-500/30'    },
    };
    const cfg = configs[status] || configs.PENDING;
    return (
        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border ${cfg.color}`}>
            {cfg.label}
        </span>
    );
};

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function PaymentPage() {
    const { id: bookingId } = useParams();
    const navigate = useNavigate();

    const [booking, setBooking]     = useState(null);
    const [loading, setLoading]     = useState(true);
    const [paying,  setPaying]      = useState(false);
    const [result,  setResult]      = useState(null); // 'success' | 'failed' | null
    const [error,   setError]       = useState(null);
    const [method,  setMethod]      = useState('razorpay'); // 'razorpay' | 'upi'

    // ── Load booking details ────────────────────────────────────────────────
    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchBookingById(bookingId);
                setBooking(data);
            } catch {
                setError('Could not load booking details.');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [bookingId]);

    // ── Initiate Razorpay checkout ──────────────────────────────────────────
    const handleRazorpay = useCallback(async () => {
        if (paying || !booking) return;
        setPaying(true);
        setError(null);

        try {
            const loaded = await loadRazorpayScript();
            if (!loaded) throw new Error('Payment gateway could not be loaded. Check your connection.');

            const order = await createPaymentOrder(bookingId);

            const options = {
                key:          order.razorpayKeyId,
                amount:       order.amountInPaise,
                currency:     order.currency || 'INR',
                name:         'Eventora',
                description:  order.eventTitle,
                order_id:     order.orderId,
                prefill: {
                    name:  order.customerName,
                    email: order.customerEmail,
                },
                theme: { color: '#E31B23' },
                modal: {
                    ondismiss: () => {
                        setPaying(false);
                        setError('Payment cancelled. Your seats remain locked for 15 minutes.');
                    }
                },
                handler: async (response) => {
                    try {
                        await verifyPayment({
                            razorpayOrderId:   response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature,
                            bookingId,
                        });
                        setResult('success');
                        setTimeout(() => navigate(`/booking/${bookingId}/confirmation`), 2500);
                    } catch {
                        setResult('failed');
                        setPaying(false);
                    }
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', () => { setResult('failed'); setPaying(false); });
            rzp.open();

        } catch (e) {
            setError(e.message || 'Something went wrong. Please try again.');
            setPaying(false);
        }
    }, [bookingId, booking, paying, navigate]);

    // ── Manual UPI Payment Confirm ──────────────────────────────────────────
    const handleUPIConfirm = useCallback(async () => {
        if (paying || !booking) return;
        setPaying(true);
        setError(null);

        try {
            await verifyManualPayment(bookingId);
            setResult('success');
            setTimeout(() => navigate(`/booking/${bookingId}/confirmation`), 2500);
        } catch (e) {
            setError('Could not confirm payment. Please try again or contact support.');
            setPaying(false);
        }
    }, [bookingId, booking, paying, navigate]);


    // ─────────────────────────────────────────────────────────────────────────
    //  Render
    // ─────────────────────────────────────────────────────────────────────────

    return (
        <div className="min-h-screen bg-[#0B0F1A] text-white">
            <Header />

            {/* Ambient glow */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[#E31B23]/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-purple-700/5 rounded-full blur-[100px]" />
            </div>

            <main className="relative z-10 pt-32 pb-32 max-w-3xl mx-auto px-6">

                {/* Back button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-3 text-white/40 hover:text-white text-[10px] font-black uppercase tracking-[0.3em] mb-14 transition-colors group"
                >
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                        <ArrowLeft size={14} />
                    </div>
                    Back
                </button>

                {/* Loading */}
                {loading && (
                    <div className="h-96 flex flex-col items-center justify-center gap-6">
                        <Loader2 size={40} className="text-[#E31B23] animate-spin" />
                        <span className="text-[10px] font-black tracking-[0.5em] uppercase text-[#E31B23] animate-pulse">
                            Loading Booking...
                        </span>
                    </div>
                )}

                {/* Error state */}
                {!loading && error && !result && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-8 bg-red-500/10 border border-red-500/20 rounded-3xl flex items-start gap-5 mb-10"
                    >
                        <AlertCircle size={22} className="text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-red-400 font-black text-sm uppercase tracking-wider mb-1">Attention</p>
                            <p className="text-red-300/70 text-xs leading-relaxed">{error}</p>
                        </div>
                    </motion.div>
                )}

                {/* Result overlay */}
                <AnimatePresence>
                    {result === 'success' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="fixed inset-0 z-50 bg-[#0B0F1A]/95 flex flex-col items-center justify-center gap-8 text-center px-6"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', damping: 12 }}
                                className="w-24 h-24 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center"
                            >
                                <CheckCircle2 size={48} className="text-emerald-400" />
                            </motion.div>
                            <div>
                                <h2 className="font-elegant text-5xl font-black italic mb-3">Payment Successful</h2>
                                <p className="text-white/50 text-xs font-bold uppercase tracking-[0.4em]">
                                    Redirecting to your confirmation...
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {result === 'failed' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-8 bg-red-500/10 border border-red-500/20 rounded-3xl flex items-start gap-5 mb-10"
                        >
                            <XCircle size={22} className="text-red-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-red-400 font-black text-sm uppercase tracking-wider mb-1">Payment Failed</p>
                                <p className="text-red-300/70 text-xs leading-relaxed">
                                    Your payment could not be processed. Your seats remain locked. Please try again.
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main payment card */}
                {!loading && booking && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {/* Header */}
                        <div className="mb-12">
                            <span className="text-[#E31B23] text-[10px] font-black tracking-[0.5em] uppercase block mb-4">
                                Secure Checkout
                            </span>
                            <h1 className="font-elegant text-5xl md:text-7xl font-black italic tracking-tighter leading-none mb-4">
                                Complete <span className="text-[#E31B23]">Payment</span>
                            </h1>
                        </div>

                        {/* Booking Summary */}
                        <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 md:p-12 mb-8 backdrop-blur-2xl">
                            <div className="flex items-start justify-between mb-10">
                                <div>
                                    <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] mb-2">
                                        Booking
                                    </p>
                                    <h3 className="font-elegant text-3xl font-black italic mb-2 leading-tight">
                                        {booking.eventTitle}
                                    </h3>
                                    <p className="text-white/50 text-[10px] font-black uppercase tracking-widest">
                                        {booking.eventVenue} · {booking.eventCity}
                                    </p>
                                </div>
                                <StatusBadge status={booking.status} />
                            </div>

                            <div className="grid grid-cols-3 gap-6 border-t border-white/5 pt-8">
                                <div>
                                    <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.4em] mb-2">Ref</p>
                                    <p className="font-mono text-sm font-bold text-[#E31B23]">{booking.bookingReference}</p>
                                </div>
                                <div>
                                    <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.4em] mb-2">Seats</p>
                                    <p className="text-xl font-black">{booking.totalSeats}</p>
                                </div>
                                <div>
                                    <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.4em] mb-2">Total</p>
                                    <p className="text-2xl font-black">
                                        ₹{parseFloat(booking.totalPrice).toLocaleString('en-IN')}
                                    </p>
                                </div>
                            </div>

                            {booking.seatNumbers?.length > 0 && (
                                <div className="mt-8 pt-8 border-t border-white/5">
                                    <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.4em] mb-4">Selected Seats</p>
                                    <div className="flex flex-wrap gap-2">
                                        {booking.seatNumbers.map(s => (
                                            <span key={s} className="px-3 py-1.5 bg-[#E31B23]/10 border border-[#E31B23]/20 rounded-full text-[#E31B23] text-[10px] font-black tracking-widest">
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Payment Options */}
                        {booking.status !== 'CONFIRMED' && (
                            <div className="mb-10">
                                <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] mb-4 text-center">
                                    Select Payment Method
                                </p>
                                <div className="flex gap-4 p-1.5 bg-white/5 border border-white/10 rounded-2xl">
                                    <button
                                        onClick={() => setMethod('razorpay')}
                                        className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                            method === 'razorpay' ? 'bg-[#E31B23] text-white shadow-lg shadow-[#E31B23]/20' : 'text-white/40 hover:text-white'
                                        }`}
                                    >
                                        <CreditCard size={16} /> Razorpay
                                    </button>
                                    <button
                                        onClick={() => setMethod('upi')}
                                        className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                            method === 'upi' ? 'bg-white text-black shadow-lg shadow-white/20' : 'text-white/40 hover:text-white'
                                        }`}
                                    >
                                        <QrCode size={16} /> UPI QR
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* UPI QR Display */}
                        {booking.status !== 'CONFIRMED' && method === 'upi' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="bg-white/5 border border-white/10 rounded-[32px] p-8 md:p-12 mb-10 flex flex-col items-center justify-center text-center backdrop-blur-2xl overflow-hidden"
                            >
                                <div className="w-56 h-56 bg-white rounded-3xl p-4 flex items-center justify-center mb-6 shadow-2xl shadow-black/50">
                                    <img src="/upi-qr.png" alt="Scan to Pay via UPI" className="w-full h-full object-contain" />
                                </div>
                                <p className="text-white font-bold text-sm mb-2">dhanushsankar4567@oksbi</p>
                                <p className="text-white/40 text-[10px] font-black uppercase tracking-widest max-w-[250px] mb-8">
                                    Scan with any UPI app to pay ₹{parseFloat(booking.totalPrice).toLocaleString('en-IN')}. Click confirm below once paid.
                                </p>
                            </motion.div>
                        )}


                        {/* CTA */}
                        {booking.status === 'CONFIRMED' ? (
                            <div className="text-center py-8">
                                <CheckCircle2 size={32} className="text-emerald-400 mx-auto mb-4" />
                                <p className="text-emerald-400 font-black text-sm uppercase tracking-widest">
                                    This booking is already confirmed.
                                </p>
                                <button
                                    onClick={() => navigate(`/booking/${bookingId}/confirmation`)}
                                    className="mt-6 px-10 py-4 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-emerald-400 transition-all magnetic-button"
                                >
                                    View Ticket
                                </button>
                            </div>
                        ) : (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={method === 'razorpay' ? handleRazorpay : handleUPIConfirm}
                                disabled={paying}
                                className={`w-full flex items-center justify-center gap-5 py-7 rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] transition-all shadow-2xl ${
                                    paying
                                        ? 'bg-white/10 text-white/40 cursor-not-allowed shadow-none'
                                        : method === 'razorpay' 
                                            ? 'bg-[#E31B23] text-white hover:bg-[#c9181f] shadow-[#E31B23]/20 hover:shadow-[#E31B23]/40'
                                            : 'bg-white text-black hover:bg-gray-200 shadow-white/20 hover:shadow-white/40'
                                    }`}
                            >
                                {paying ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        {method === 'razorpay' ? 'Opening Payment Gateway...' : 'Verifying Payment...'}
                                    </>
                                ) : (
                                    <>
                                        {method === 'razorpay' ? <CreditCard size={18} /> : <CheckCircle2 size={18} />}
                                        {method === 'razorpay' 
                                            ? `Pay ₹${parseFloat(booking.totalPrice).toLocaleString('en-IN')} Securely`
                                            : `I Have Paid ₹${parseFloat(booking.totalPrice).toLocaleString('en-IN')}`
                                        }
                                    </>
                                )}
                            </motion.button>
                        )}

                        {/* Info line */}
                        <p className="text-center text-white/20 text-[9px] font-bold uppercase tracking-[0.3em] mt-6">
                            Powered by Razorpay · UPI · Cards · Net Banking · Wallets
                        </p>
                    </motion.div>
                )}
            </main>
        </div>
    );
}

