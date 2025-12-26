import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartNotification from '@/components/CartNotification';
import { CartProvider } from '@/context/CartContext';
import Providers from '@/components/Providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Reef Forge',
  description: '3D printed prodcuts for reef tanks',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <CartProvider>
            <div className="app-container">
              <Header />
              <main className="main-content">{children}</main>
              <Footer />
            </div>
            <CartNotification />
          </CartProvider>
        </Providers>
      </body>
    </html>
  );
}
