'use client';

import { useState } from 'react';
import Image from 'next/image';
import { products, productCategories } from '@/data/products';

export default function ProductShowcase() {
    const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
    const [viewingProduct, setViewingProduct] = useState<any>(null);

    const filteredProducts = selectedCategory === 'Todos'
        ? products
        : products.filter(p => p.category === selectedCategory);

    return (
        <section id="productos" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
            {/* Modal de Detalle */}
            {viewingProduct && (
                <div className="fixed inset-0 bg-black/60 z-[2000] flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="p-6 md:p-8">
                            <div className="flex justify-between items-start mb-6">
                                <h3 className="text-3xl font-bold text-cilo-dark">{viewingProduct.name}</h3>
                                <button
                                    onClick={() => setViewingProduct(null)}
                                    className="text-gray-400 hover:text-cilo-primary text-2xl"
                                >✕</button>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Galería */}
                                <div>
                                    <div className="bg-gray-100 rounded-xl p-4 mb-4">
                                        <Image
                                            src={viewingProduct.image}
                                            alt={viewingProduct.name}
                                            width={400}
                                            height={300}
                                            className="w-full h-auto object-contain"
                                        />
                                    </div>
                                </div>

                                {/* Info */}
                                <div>
                                    <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">Descripción</h4>
                                    <p className="text-gray-600 mb-6">{viewingProduct.description}</p>

                                    {viewingProduct.technicalSpecs?.ingredients && (
                                        <>
                                            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">Ingredientes / Composición</h4>
                                            <p className="text-sm text-gray-500 mb-6 italic">{viewingProduct.technicalSpecs.ingredients}</p>
                                        </>
                                    )}

                                    {viewingProduct.technicalSpecs?.formats && (
                                        <>
                                            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">Formatos Disponibles</h4>
                                            <ul className="grid grid-cols-1 gap-2 mb-8">
                                                {viewingProduct.technicalSpecs.formats.map((f: string, i: number) => (
                                                    <li key={i} className="flex items-center gap-2 text-sm text-cilo-dark font-medium bg-cilo-accent/30 p-2 rounded-lg">
                                                        <span className="text-cilo-primary">📦</span> {f}
                                                    </li>
                                                ))}
                                            </ul>
                                        </>
                                    )}

                                    <button
                                        className="btn-primary w-full py-4 text-center"
                                        onClick={() => window.open(`https://wa.me/5491157633328?text=Hola,%20me%20interesa%20el%20producto%20${viewingProduct.name}`, '_blank')}
                                    >
                                        Consultar Stock Mayorista
                                    </button>
                                </div>
                            </div>

                            {/* Imágenes Secundarias (Full Width) */}
                            {viewingProduct.packagingImages && (
                                <div className="mt-10 border-t border-gray-100 pt-8">
                                    <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-6 text-center">Información Adicional</h4>
                                    <div className="flex flex-col gap-8 w-full">
                                        {viewingProduct.packagingImages.map((img: string, i: number) => (
                                            <div key={i} className="w-full rounded-xl overflow-hidden bg-white">
                                                <Image
                                                    src={img}
                                                    alt="Presentación Adicional"
                                                    width={1200}
                                                    height={1200}
                                                    className="w-full h-auto object-contain mx-auto"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold text-cilo-dark mb-4">
                        Nuestros Productos
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                        Galletitas artesanales fabricadas con ingredientes de primera calidad.
                        Más de 25 variedades para distribuidores mayoristas.
                    </p>

                    {/* Category Filter */}
                    <div className="flex flex-wrap justify-center gap-3 mb-8">
                        <button
                            onClick={() => setSelectedCategory('Todos')}
                            className={`px-6 py-2 rounded-full font-semibold transition-all ${selectedCategory === 'Todos'
                                ? 'bg-cilo-primary text-white shadow-lg scale-105'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            Todos ({products.length})
                        </button>
                        {productCategories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-6 py-2 rounded-full font-semibold transition-all ${selectedCategory === category
                                    ? 'bg-cilo-primary text-white shadow-lg scale-105'
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Products Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                    {filteredProducts.map((product) => (
                        <div
                            key={product.id}
                            onClick={() => setViewingProduct(product)}
                            className="card group hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer"
                        >
                            {/* Product Image */}
                            <div className="relative w-full h-48 mb-4 bg-white rounded-lg overflow-hidden">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-contain p-4 group-hover:scale-110 transition-transform duration-300"
                                />
                            </div>

                            {/* Category Badge */}
                            <div className="inline-block px-3 py-1 bg-cilo-accent rounded-full mb-3">
                                <span className="text-xs font-semibold text-cilo-secondary">
                                    {product.category}
                                </span>
                            </div>

                            {/* Product Info */}
                            <h3 className="text-lg font-bold text-cilo-dark mb-2">
                                {product.name}
                            </h3>
                            <p className="text-gray-600 mb-3 text-sm line-clamp-2">
                                {product.description}
                            </p>

                            {/* Weight if available */}
                            {product.weight && (
                                <div className="border-t border-gray-200 pt-3 mt-auto">
                                    <p className="text-xs text-gray-500">Presentación</p>
                                    <p className="text-sm font-semibold text-cilo-primary">
                                        {product.weight}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* CTA Section */}
                <div className="text-center bg-white rounded-2xl p-8 shadow-lg">
                    <h3 className="text-2xl font-bold text-cilo-dark mb-4">
                        ¿Necesitás un catálogo completo?
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                        Consultanos por precios mayoristas, pedidos personalizados y disponibilidad.
                        También podés descargar nuestros folletos digitales.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <a
                            href="https://wa.me/5491157633328?text=Hola%20Cilo,%20necesito%20información%20de%20productos%20mayoristas"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary inline-flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                            </svg>
                            Consultar por WhatsApp
                        </a>
                        <a
                            href="/products/FOLLETO 1.jpg"
                            download
                            className="btn-secondary inline-flex items-center gap-2"
                        >
                            📄 Descargar Folleto 1
                        </a>
                        <a
                            href="/products/FOLLETO 2.jpg"
                            download
                            className="btn-secondary inline-flex items-center gap-2"
                        >
                            📄 Descargar Folleto 2
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
