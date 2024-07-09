import { NextUIProvider } from '@nextui-org/react';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { Metadata } from 'next';
import Footer from '@/components/footer/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: 'estadio',
  description: 'prueba de soluciones'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <NextUIProvider>
          {children}
          <Footer />
        </NextUIProvider>
      </body>
    </html>
  );
}
