import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User as UserIcon } from 'lucide-react';

export const AuthModal = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState('login'); // 'login' or 'signup'

    const handleGoogleLogin = () => {
        // Redirect to backend OAuth2 endpoint
        window.location.href = 'http://localhost:8080/oauth2/authorization/google';
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Dark blur background overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-md"
                    />

                    {/* Slide in from right modal */}
                    <motion.div
                        initial={{ x: '100%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-white/10 backdrop-blur-2xl border-l border-white/20 shadow-2xl z-[210] flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/10">
                            <h2 className="text-2xl font-black italic tracking-tighter text-white">
                                EVENT<span className="text-[#E31B23]">ORA</span>
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-8 flex-1 overflow-y-auto w-full flex flex-col">
                            {/* Tabs */}
                            <div className="flex bg-white/5 p-1 rounded-2xl mb-10 w-full relative">
                                <div
                                    className="flex-1 text-center py-3 rounded-xl cursor-pointer text-sm font-bold transition-all z-10"
                                    onClick={() => setActiveTab('login')}
                                    style={{ color: activeTab === 'login' ? '#000' : 'rgba(255,255,255,0.7)' }}
                                >
                                    LOGIN
                                </div>
                                <div
                                    className="flex-1 text-center py-3 rounded-xl cursor-pointer text-sm font-bold transition-all z-10"
                                    onClick={() => setActiveTab('signup')}
                                    style={{ color: activeTab === 'signup' ? '#000' : 'rgba(255,255,255,0.7)' }}
                                >
                                    SIGNUP
                                </div>
                                <motion.div
                                    className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-xl shadow-md z-0"
                                    animate={{ left: activeTab === 'login' ? '4px' : 'calc(50%)' }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                />
                            </div>

                            {/* Forms */}
                            <div className="flex flex-col gap-5 mb-8 w-full">
                                {activeTab === 'signup' && (
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <UserIcon size={18} className="text-white/40" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Full Name"
                                            className="w-full bg-black/20 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-white/40 outline-none focus:border-[#E31B23] focus:ring-1 focus:ring-[#E31B23] transition-all"
                                        />
                                    </div>
                                )}

                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail size={18} className="text-white/40" />
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="Email Address"
                                        className="w-full bg-black/20 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-white/40 outline-none focus:border-[#E31B23] focus:ring-1 focus:ring-[#E31B23] transition-all"
                                    />
                                </div>

                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock size={18} className="text-white/40" />
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        className="w-full bg-black/20 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-white/40 outline-none focus:border-[#E31B23] focus:ring-1 focus:ring-[#E31B23] transition-all"
                                    />
                                </div>

                                {activeTab === 'login' && (
                                    <div className="flex justify-end">
                                        <a href="#" className="text-xs text-white/60 hover:text-white transition-colors">Forgot Password?</a>
                                    </div>
                                )}

                                <button className="w-full py-4 mt-2 bg-[#E31B23] hover:bg-[#c9181f] text-white rounded-xl font-black text-sm tracking-widest uppercase shadow-lg shadow-[#E31B23]/30 hover:shadow-[#E31B23]/50 hover:scale-[1.02] transition-all duration-300">
                                    {activeTab === 'login' ? 'Access The Pulse' : 'Join The Pulse'}
                                </button>
                            </div>

                            {/* Divider */}
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-px bg-white/10 flex-1" />
                                <span className="text-white/40 text-xs font-semibold uppercase">Or continue with</span>
                                <div className="h-px bg-white/10 flex-1" />
                            </div>

                            {/* Premium Google Button */}
                            <button
                                onClick={handleGoogleLogin}
                                className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-white text-gray-900 font-bold shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(255,255,255,0.2)] hover:scale-[1.02] transition-all duration-300"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Continue with Google
                            </button>

                            <p className="text-center mt-auto pt-8 text-xs text-white/50">
                                By continuing, you agree to Eventora's <a href="#" className="text-white hover:underline">Terms of Service</a> and <a href="#" className="text-white hover:underline">Privacy Policy</a>.
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
