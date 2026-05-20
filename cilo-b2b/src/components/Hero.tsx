'use client';

import Image from 'next/image';

export default function Hero() {
    return (
        <section id="inicio" className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">

            {/* Background gradient */}
            <div className="absolute inset-0 gradient-gold opacity-10"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Left Column - Text */}
                    <div className="space-y-8">
                        <div className="inline-block px-4 py-2 bg-cilo-accent rounded-full">
                            <p className="text-cilo-secondary font-semibold text-sm">
                                🍪 Más de 40 años de tradición
                            </p>
                        </div>

                        <h1 className="text-5xl md:text-6xl font-bold text-cilo-dark leading-tight">
                            Fábrica de Galletitas <span className="text-cilo-primary">Cilo</span>
                        </h1>

                        <p className="text-xl text-gray-600 leading-relaxed">
                            Somos fabricantes directos. Distribuímos a kioscos, almacenes, dietéticas y supermercados en toda Argentina. Precios mayoristas competitivos y entrega garantizada.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <a
                                href="https://wa.me/5491157633328?text=Hola%20Cilo,%20quiero%20información%20sobre%20pedidos%20mayoristas"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary text-center"
                            >
                                📱 Hacer Pedido por WhatsApp
                            </a>
                            <button
                                onClick={() => document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' })}
                                className="btn-secondary text-center"
                            >
                                Ver Catálogo
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
                            <div>
                                <p className="text-3xl font-bold text-cilo-primary">40+</p>
                                <p className="text-sm text-gray-600">Años de experiencia</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-cilo-primary">500+</p>
                                <p className="text-sm text-gray-600">Clientes mayoristas</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-cilo-primary">100%</p>
                                <p className="text-sm text-gray-600">Calidad garantizada</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Real Product Image */}
                    <div className="relative">
                        <div className="relative bg-gradient-to-br from-cilo-accent to-white rounded-3xl shadow-2xl overflow-hidden p-8">
                            <div className="relative w-full aspect-square">
                                <Image
                                    src="/products/LENG BAÑ 300.png"
                                    alt="Lengüitas Cilo - Producto Estrella"
                                    fill
                                    className="object-contain drop-shadow-2xl"
                                    priority
                                />
                            </div>
                            <div className="text-center mt-4">
                                <p className="text-2xl font-bold text-cilo-dark mb-2">Lengüitas con Baño de Chocolate</p>
                                <p className="text-cilo-secondary">Nuestro producto estrella</p>
                            </div>
                        </div>

                        {/* Floating badge */}
                        <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-6 border-4 border-cilo-primary">
                            <p className="text-sm text-gray-600">Desde</p>
                            <p className="text-3xl font-bold text-cilo-primary">1980</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
