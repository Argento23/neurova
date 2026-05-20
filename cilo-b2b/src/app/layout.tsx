import type { Metadata } from "next";
import "./globals.css";
import AIFloatingButton from "@/components/AIFloatingButton";

export const metadata: Metadata = {
    title: "Cilo - Fábrica de Galletitas | Distribución Mayorista",
    description: "Fabricamos galletitas de calidad premium desde 1980. Distribución mayorista para kioscos, almacenes y supermercados en toda Argentina.",
    keywords: "galletitas mayorista, distribucion galletitas, galletitas argentina, cilo, fabricante galletitas",
    icons: {
        icon: '/favicon-16x16.png',
        shortcut: '/favicon-16x16.png',
        apple: '/favicon-16x16.png',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
            <body className="antialiased">
                {children}
                <AIFloatingButton />
            </body>
        </html>
    );
}
