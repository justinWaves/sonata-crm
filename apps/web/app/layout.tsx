import "./globals.css";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from '@/components/ErrorBoundary';

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sonata CRM",
  description: "Modern booking and management for piano technicians.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`bg-gray-50 ${geist.className}`}>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
        <Toaster />
      </body>
    </html>
  );
}
