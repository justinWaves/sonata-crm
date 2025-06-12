import Header from '@/components/Header';
import Link from 'next/link';

const navItems = [
  { label: 'Appointments', href: '/tech/dashboard/appointments' },
  { label: 'Availability', href: '/tech/dashboard/availability' },
  { label: 'Customers', href: '/tech/dashboard/customers' },
  { label: 'Services', href: '/tech/dashboard/services' },
  { label: 'Account', href: '/tech/dashboard/account' },
  { label: 'Log out', href: '/' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
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