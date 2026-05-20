const benefits = [
    {
        icon: '🏭',
        title: 'Fabricantes Directos',
        description: 'Sin intermediarios. Mejores precios mayoristas del mercado.'
    },
    {
        icon: '📦',
        title: 'Entrega Garantizada',
        description: 'Envíos a toda Argentina. Logística confiable y puntual.'
    },
    {
        icon: '💰',
        title: 'Descuentos por Volumen',
        description: 'Cuanto más comprás, más ahorrás. Planes especiales para distribuidores.'
    },
    {
        icon: '✅',
        title: '40 Años de Calidad',
        description: 'Desde 1980 manteniendo los más altos estándares de producción.'
    },
    {
        icon: '🤝',
        title: 'Atención Personalizada',
        description: 'Asesoramiento comercial directo. Respondemos todas tus consultas.'
    },
    {
        icon: '📊',
        title: 'Stock Permanente',
        description: 'Producción continua. Nunca te quedás sin mercadería.'
    }
];

export default function WhyChooseUs() {
    return (
        <section id="nosotros" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-cilo-dark mb-4">
                        ¿Por Qué Elegir Cilo?
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Somos el partner ideal para hacer crecer tu negocio
                    </p>
                </div>

                {/* Benefits Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {benefits.map((benefit, index) => (
                        <div
                            key={index}
                            className="flex items-start space-x-4 p-6 rounded-xl hover:bg-cilo-accent/30 transition-colors duration-300"
                        >
                            <div className="text-5xl flex-shrink-0">
                                {benefit.icon}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-cilo-dark mb-2">
                                    {benefit.title}
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    {benefit.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Trust Badge */}

            </div>
        </section>
    );
}
