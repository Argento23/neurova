'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setIsOpen(false); // Close mobile menu
        }
    };

    return (
        <nav className="fixed w-full z-50 bg-white/95 backdrop-blur-sm shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <button onClick={() => scrollToSection('inicio')} className="flex items-center space-x-3">
                            <div className="relative w-14 h-14">
                                <Image
                                    src="/logo.png"
                                    alt="Cilo Logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <div>

                                <div className="flex flex-col">
                                    <p className="text-xs text-cilo-secondary">Dulce tradición desde 1980</p>
                                </div>
                            </div>
                        </button>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <button
                            onClick={() => scrollToSection('inicio')}
                            className="text-cilo-dark hover:text-cilo-primary transition-colors font-medium"
                        >
                            Inicio
                        </button>
                        <button
                            onClick={() => scrollToSection('productos')}
                            className="text-cilo-dark hover:text-cilo-primary transition-colors font-medium"
                        >
                            Productos
                        </button>
                        <button
                            onClick={() => scrollToSection('nosotros')}
                            className="text-cilo-dark hover:text-cilo-primary transition-colors font-medium"
                        >
                            Nosotros
                        </button>
                        <a
                            href="https://wa.me/5491157633328?text=Hola%20Cilo,%20necesito%20información%20para%20pedido%20mayorista"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary"
                        >
                            Hacer Pedido
                        </a>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-cilo-dark hover:text-cilo-primary p-2"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-gray-200">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        <button
                            onClick={() => scrollToSection('inicio')}
                            className="block w-full text-left px-3 py-2 text-cilo-dark hover:bg-cilo-accent rounded-md font-medium"
                        >
                            Inicio
                        </button>
                        <button
                            onClick={() => scrollToSection('productos')}
                            className="block w-full text-left px-3 py-2 text-cilo-dark hover:bg-cilo-accent rounded-md font-medium"
                        >
                            Productos
                        </button>
                        <button
                            onClick={() => scrollToSection('nosotros')}
                            className="block w-full text-left px-3 py-2 text-cilo-dark hover:bg-cilo-accent rounded-md font-medium"
                        >
                            Nosotros
                        </button>
                        <a
                            href="https://wa.me/5491157633328?text=Hola%20Cilo,%20necesito%20información%20para%20pedido%20mayorista"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block px-3 py-2 text-center bg-cilo-primary text-white rounded-md font-medium"
                        >
                            Hacer Pedido
                        </a>
                    </div>
                </div>
            )}
        </nav>
    );
}
