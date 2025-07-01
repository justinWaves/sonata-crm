'use client';

import { SessionProvider } from 'next-auth/react';
import { CustomerProvider } from './CustomerContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CustomerProvider>
        {children}
      </CustomerProvider>
    </SessionProvider>
  );
} 