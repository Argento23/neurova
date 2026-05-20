'use client';

import { useState } from 'react';
import { translations } from '@/data/translations';
import Navbar from '@/components/Navbar';
import AIFloatingButton from '@/components/AIFloatingButton';
import { motion } from 'framer-motion';

export default function Home() {
  const [lang, setLang] = useState('de');
  const t = translations[lang as keyof typeof translations];

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 bg-[#0a0e27]">
        <div className="absolute inset-0 opacity-30 animate-gradient-shift bg-[radial-gradient(at_27%_37%,hsla(215,98%,61%,1)_0px,transparent_50%),radial-gradient(at_97%_21%,hsla(340,100%,76%,1)_0px,transparent_50%),radial-gradient(at_52%_99%,hsla(254,88%,64%,1)_0px,transparent_50%)]" />
      </div>

      <Navbar lang={lang} setLang={setLang} t={t} />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-template-columns-[1.2fr_1fr] gap-12 items-center min-h-[80vh]">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <h1
              className="text-5xl lg:text-7xl font-black font-outfit leading-tight text-white"
              dangerouslySetInnerHTML={{ __html: t.hero.title }}
            />
            <p className="text-xl text-slate-400 max-w-xl leading-relaxed">
              {t.hero.subtitle}
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="https://wa.me/5491173719972?text=Hola%2C%20quiero%20reservar%20una%20demo%20gratuita"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-[#f093fb] to-[#f5576c] px-10 py-5 rounded-2xl font-black text-lg shadow-2xl shadow-pink-500/20 hover:scale-105 transition-transform inline-block"
              >
                {t.hero.cta}
              </a>
              <button
                onClick={() => window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' })}
                className="bg-white/5 border border-white/10 px-10 py-5 rounded-2xl font-black text-lg hover:bg-white/10 transition-colors backdrop-blur-md"
              >
                {t.hero.secondary}
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative group"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500 to-purple-500 opacity-20 blur-3xl group-hover:opacity-30 transition-opacity" />
            <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-4 p-lg-10 overflow-hidden shadow-2xl">
              <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/assets/swiss-village-beautiful-mountains-austria.jpg"
                  alt="Hotel Austria"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <AIFloatingButton lang={lang} />
    </main>
  );
}
