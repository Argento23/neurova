'use client';

export default function Navbar() {
    const waLink = "https://wa.me/5491173585449?text=Hola%20GenerArise%2C%20quiero%20una%20consulta%20gratuita";
    return (
        <nav className="fixed w-full z-50 bg-white/70 backdrop-blur-xl border-b border-gray-100 py-4">
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                        GR
                    </div>
                    <span className="text-2xl font-black text-slate-800 font-outfit">
                        GenerArise
                    </span>
                </div>

                <div className="flex items-center gap-6">
                    <a href="#servicios" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Servicios</a>
                    <a href="#proyectos" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Proyectos</a>
                    <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:scale-105 transition-all shadow-lg shadow-blue-500/20"
                    >
                        Consulta Gratuita
                    </a>
                </div>
            </div>
        </nav>
    );
}
