'use client';

import Header from '@/components/Header';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Providers from '@/providers/Providers';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';

const navItems = [
  { label: 'Dashboard', href: '/tech/dashboard' },
  { label: 'Appointments', href: '/tech/dashboard/appointments' },
  { label: 'Availability', href: '/tech/dashboard/availability' },
  { label: 'Customers', href: '/tech/dashboard/customers' },
  { label: 'Services', href: '/tech/dashboard/services' },
  { label: 'Account', href: '/tech/dashboard/account' },
];

function DashboardContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/tech/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return null;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="w-full min-w-0 md:min-w-[1024px]">
      <Header onMenuClick={() => setSidebarOpen(true)} />
      <div className="flex h-[calc(100vh-56px)] bg-gray-50 pt-[56px]">
        {/* Sidebar */}
        <Sidebar show="desktop" navItems={navItems} />
        <Sidebar show="mobile" open={sidebarOpen} onClose={() => setSidebarOpen(false)} navItems={navItems} />
        {/* Main content */}
        <main className="flex-1 flex flex-col overflow-y-auto">
          <div className="max-w-7xl mx-auto w-full p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <DashboardContent>{children}</DashboardContent>
    </Providers>
  );
} 