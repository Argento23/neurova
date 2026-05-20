'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export default function AIChatWindow({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: '¡Hola! Soy el asistente virtual de Galletitas Cilo. 🍪 ¿En qué puedo ayudarte hoy? Puedo enviarte nuestro catálogo, lista de precios o informarte sobre nuestros productos mayoristas.' }
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
                setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
            } else {
                setMessages(prev => [...prev, { role: 'assistant', content: 'Lo siento, hubo un error al procesar tu mensaje.' }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Error de conexión. Inténtalo de nuevo.' }]);
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
                    <div className="bg-gradient-to-r from-cilo-primary to-cilo-secondary p-4 text-white flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">🤖</div>
                            <div>
                                <h3 className="font-bold text-sm">Asistente Cilo IA</h3>
                                <p className="text-[10px] opacity-80">En línea ahora</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[400px] min-h-[300px]">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${m.role === 'user'
                                    ? 'bg-cilo-primary text-white rounded-tr-none'
                                    : 'bg-gray-100 text-gray-800 rounded-tl-none'
                                    }`}>
                                    {m.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start italic text-xs text-gray-400">
                                Escribiendo...
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-gray-100 flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Haz una pregunta..."
                            className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-cilo-primary outline-none"
                        />
                        <button
                            onClick={handleSend}
                            disabled={isLoading}
                            className="bg-cilo-primary text-white p-2 rounded-xl hover:bg-cilo-secondary transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                            </svg>
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
