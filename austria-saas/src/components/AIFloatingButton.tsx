'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AIChatWindow from './AIChatWindow';

export default function AIFloatingButton({ lang }: { lang: string }) {
    const [isHovered, setIsHovered] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);

    return (
        <>
            {/* Control container */}
            <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
                {/* Tooltip / Call to Action */}
                <AnimatePresence>
                    {isHovered && !isChatOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="mb-4 mr-2 bg-white text-slate-800 px-4 py-3 rounded-xl shadow-2xl border border-gray-100 max-w-xs"
                        >
                            <p className="text-sm font-medium">✨ {lang === 'es' ? '¡Prueba nuestro Concierge IA!' : lang === 'de' ? 'Probieren Sie unseren KI-Concierge aus!' : 'Try our AI Concierge!'}</p>
                            <p className="text-xs text-gray-500 mt-1">{lang === 'es' ? 'Consultas de reserva y servicios en segundos.' : lang === 'de' ? 'Buchungsanfragen und Services in Sekunden.' : 'Booking inquiries and services in seconds.'}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main Button */}
                <motion.button
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsChatOpen(!isChatOpen);
                    }}
                    className="relative group flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-full shadow-2xl cursor-pointer hover:shadow-purple-500/50 transition-shadow duration-300 z-[101]"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {/* Ping Animation */}
                    {!isChatOpen && (
                        <span className="absolute inline-flex h-full w-full rounded-full bg-purple-500 opacity-30 animate-ping"></span>
                    )}

                    {/* Icon */}
                    {isChatOpen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-8 h-8"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                        </svg>
                    )}
                </motion.button>
            </div>

            <AIChatWindow isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} lang={lang} />
        </>
    );
}
