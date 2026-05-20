export default function ContactCTA() {
    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-brown text-white">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                    ¿Listo para Hacer tu Primer Pedido?
                </h2>
                <p className="text-xl mb-8 opacity-90">
                    Nuestro sistema inteligente y Asistentes IA procesan tu pedido al instante.
                    Recibí lista de precios y catálogo completo en segundos por WhatsApp.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <a
                        href="https://wa.me/5491157633328?text=Hola%20Cilo,%20quiero%20hacer%20un%20pedido%20mayorista"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white text-cilo-dark font-bold py-4 px-8 rounded-lg hover:bg-cilo-accent transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 inline-flex items-center space-x-2"
                    >
                        <span className="text-2xl">📱</span>
                        <span>WhatsApp: +54 9 11 5763-3328</span>
                    </a>

                    <a
                        href="mailto:cilo@cilo.com.ar"
                        className="bg-transparent border-2 border-white text-white font-bold py-4 px-8 rounded-lg hover:bg-white hover:text-cilo-dark transition-all duration-300 inline-flex items-center space-x-2"
                    >
                        <span className="text-2xl">📧</span>
                        <span>cilo@cilo.com.ar</span>
                    </a>
                </div>

                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm opacity-90">
                    <div>
                        <p className="font-semibold mb-1">⏰ Horario de Atención</p>
                        <p>Lunes a Viernes 8:00 - 18:00</p>
                    </div>
                    <div>
                        <p className="font-semibold mb-1">🚚 Envíos</p>
                        <p>A todo el país</p>
                    </div>
                    <div>
                        <p className="font-semibold mb-1">💳 Formas de Pago</p>
                        <p>Efectivo, Transferencia, Mercado Pago</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
