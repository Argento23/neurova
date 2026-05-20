import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ProductShowcase from '@/components/ProductShowcase';
import WhyChooseUs from '@/components/WhyChooseUs';

import Footer from '@/components/Footer';

export default function Home() {
    return (
        <main className="min-h-screen">
            <Navbar />
            <Hero />
            <ProductShowcase />
            <WhyChooseUs />

            <Footer />
        </main>
    );
}
