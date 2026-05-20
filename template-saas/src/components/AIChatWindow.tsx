'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UNIVERSAL_AI_CONFIG } from '@/data/ai-config';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export default function AIChatWindow({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: UNIVERSAL_AI_CONFIG.welcomeMessage }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const speak = (text: string) => {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES'; // Default, but AI can be multilingual
        window.speechSynthesis.speak(utterance);
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = { role: 'user' as const, content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: [...messages, userMessage] }),
            });

            const data = await response.json();
            if (data.message) {
                const assistantMsg = { role: 'assistant' as const, content: data.message };
                setMessages(prev => [...prev, assistantMsg]);
                // Proactive speech for new assistant messages
                speak(data.message);
            } else {
                setMessages(prev => [...prev, { role: 'assistant', content: 'Lo siento, hubo un error.' }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Error de conexión.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col z-[999] overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-4 text-white flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-lg">🤖</div>
                            <div>
                                <h3 className="font-bold text-sm">{UNIVERSAL_AI_CONFIG.name} - Consultor IA</h3>
                                <p className="text-[10px] opacity-80">En línea · Neurova Agencia AI</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-lg transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[400px] min-h-[300px] bg-slate-50/50">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`relative max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${m.role === 'user'
                                    ? 'bg-blue-600 text-white rounded-tr-none'
                                    : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none pr-8'
                                    }`}>
                                    {m.content}
                                    {m.role === 'assistant' && (
                                        <button
                                            onClick={() => speak(m.content)}
                                            className="absolute top-2 right-2 text-gray-400 hover:text-blue-500 transition-colors"
                                            title="Escuchar"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start items-center gap-2 text-xs text-gray-400">
                                <span className="flex gap-1">
                                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></span>
                                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                </span>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-gray-100 flex gap-2 bg-white">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Escribe tu mensaje..."
                            className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
                        />
                        <button
                            onClick={handleSend}
                            disabled={isLoading}
                            className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 shadow-md hover:shadow-blue-500/20"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-white">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                            </svg>
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
