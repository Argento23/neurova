'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Navbar({ lang, setLang, t }: { lang: string; setLang: (l: string) => void; t: any }) {
    return (
        <nav className="fixed w-full z-50 bg-[#0a0e27]/40 backdrop-blur-xl border-b border-white/5 py-4">
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10">
                        <Image src="/logo.png" alt="Argenterío" fill className="object-contain" />
                    </div>
                    <span className="text-2xl font-black bg-gradient-to-r from-[#f093fb] to-[#f5576c] bg-clip-text text-transparent font-outfit">
                        Argenterío
                    </span>
                </div>

                <div className="flex items-center gap-8">
                    <div className="bg-white/5 p-1 rounded-full border border-white/10 flex gap-1">
                        {[
                            { code: 'de', label: '🇦🇹 DE' },
                            { code: 'en', label: '🇬🇧 EN' },
                            { code: 'es', label: '🇪🇸 ES' }
                        ].map((l) => (
                            <button
                                key={l.code}
                                onClick={() => setLang(l.code)}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${lang === l.code
                                        ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_20px_rgba(0,245,255,0.2)]'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {l.label}
                            </button>
                        ))}
                    </div>

                    <button className="bg-gradient-to-r from-[#f093fb] to-[#f5576c] px-6 py-2 rounded-full font-bold text-sm hover:scale-105 transition-transform shadow-lg shadow-pink-500/20">
                        {t.nav.kontakt}
                    </button>
                </div>
            </div>
        </nav>
    );
}
