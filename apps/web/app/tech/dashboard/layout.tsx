'use client';

import Header from '@/components/Header';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Providers from '@/providers/Providers';
import { useEffect } from 'react';

const navItems = [
  { label: 'Dashboard', href: '/tech/dashboard' },
  { label: 'Appointments', href: '/tech/dashboard/appointments' },
  { label: 'Availability', href: '/tech/dashboard/availability' },
  { label: 'Customers', href: '/tech/dashboard/customers' },
  { label: 'Pianos', href: '/tech/dashboard/pianos' },
  { label: 'Services', href: '/tech/dashboard/services' },
  { label: 'Account', href: '/tech/dashboard/account' },
];

function DashboardContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session, status } = useSession();

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
    <>
      <Header />
      <div className="flex min-h-[calc(100vh-56px)] bg-gray-50">
        {/* Sidebar */}
        <aside className="w-56 bg-white border-r border-gray-200 flex flex-col py-8 px-4">
          <nav className="flex-1 flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="px-3 py-2 rounded hover:bg-gray-100 text-gray-800 font-medium"
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={async () => {
                await signOut({ redirect: false });
                router.push('/');
              }}
              className="px-3 py-2 rounded hover:bg-gray-100 text-gray-800 font-medium text-left cursor-pointer mt-2"
            >
              Log out
            </button>
          </nav>
        </aside>
        {/* Main content */}
        <main className="flex-1 flex flex-col">
          {children}
        </main>
      </div>
    </>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <DashboardContent>{children}</DashboardContent>
    </Providers>
  );
} 