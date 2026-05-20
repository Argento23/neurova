'use client';

import Navbar from '@/components/Navbar';
import AIFloatingButton from '@/components/AIFloatingButton';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm font-bold tracking-wide uppercase">
              Agencia de Automatización IA
            </div>
            <h1 className="text-6xl lg:text-7xl font-black font-outfit leading-tight text-slate-900">
              Escalamos tu negocio con <span className="text-blue-600">IA Inteligente.</span>
            </h1>
            <p className="text-xl text-slate-500 max-w-xl leading-relaxed">
              Implementamos agentes de voz, chatbots avanzados y automatizaciones que permiten a tu equipo enfocarse en lo que importa mientras nosotros optimizamos el resto.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="https://wa.me/5491173585449?text=Hola%20GenerArise%2C%20quiero%20solicitar%20mi%20auditor%C3%ADa%20gratuita%20de%20IA"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-black text-lg shadow-2xl shadow-blue-500/30 hover:scale-105 transition-transform inline-block"
              >
                Solicitar Auditoría Gratuita
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="absolute -inset-10 bg-blue-100/50 rounded-full blur-3xl opacity-50" />
            <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl bg-gradient-to-br from-slate-900 to-blue-950 flex items-center justify-center">
              {/* Animated AI Visualization */}
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Orbiting rings */}
                <div className="absolute w-64 h-64 rounded-full border border-blue-500/20 animate-spin" style={{ animationDuration: '12s' }} />
                <div className="absolute w-48 h-48 rounded-full border border-blue-400/30 animate-spin" style={{ animationDuration: '8s', animationDirection: 'reverse' }} />
                <div className="absolute w-32 h-32 rounded-full border border-cyan-400/40 animate-spin" style={{ animationDuration: '5s' }} />
                {/* Center core */}
                <div className="relative z-10 w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 shadow-2xl shadow-blue-500/50 flex items-center justify-center">
                  <span className="text-3xl">🤖</span>
                </div>
                {/* Floating data points */}
                {['n8n', 'Vapi', 'IA', 'API', 'CRM', 'Bot'].map((label, i) => (
                  <div
                    key={i}
                    className="absolute text-xs font-bold text-blue-300/70 bg-blue-900/50 px-2 py-1 rounded-full border border-blue-500/20"
                    style={{
                      top: `${20 + Math.sin(i * 60 * Math.PI / 180) * 35}%`,
                      left: `${50 + Math.cos(i * 60 * Math.PI / 180) * 35}%`,
                    }}
                  >
                    {label}
                  </div>
                ))}
                {/* Bottom label */}
                <div className="absolute bottom-6 text-center">
                  <p className="text-blue-400/60 text-xs font-medium tracking-widest uppercase">Automatización IA</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="py-20 bg-slate-50/50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8 text-center">
          {[
            { title: 'Agentes de Voz 24/7', desc: 'Atención telefónica inteligente que califica leads y agenda reuniones automáticamente.' },
            { title: 'Automatización n8n', desc: 'Conectamos tus herramientas para eliminar tareas repetitivas y escalar sin contratar.' },
            { title: 'SaaS Multi-Rubro', desc: 'Interfaces personalizadas para Inmobiliarias, Clínicas, Retail, Legal y más.' }
          ].map((f, i) => (
            <div key={i} className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <h3 className="text-xl font-bold mb-3">{f.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <AIFloatingButton />
    </main>
  );
}
