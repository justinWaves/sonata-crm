import "./globals.css";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from '@/components/ErrorBoundary';
import Footer from '@/components/Footer';

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sonata CRM – Piano Technician & Music Teacher Scheduling",
  description: "Modern booking, reminders, and client management. Flat-rate plans starting at $14/month.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`bg-gray-50 ${geist.className}`}>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
        <Toaster />
        <Footer />
      </body>
    </html>
  );
}
