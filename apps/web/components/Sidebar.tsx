import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React from 'react';

interface NavItem {
  label: string;
  href: string;
}

interface SidebarProps {
  open?: boolean; // for mobile drawer
  onClose?: () => void;
  navItems: NavItem[];
  show: 'desktop' | 'mobile';
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose, navItems, show }) => {
  const router = useRouter();
  const { data: session } = useSession();

  // Desktop sidebar
  if (show === 'desktop') {
    return (
      <aside className="w-56 bg-white border-r border-gray-200 flex-col py-8 px-4 hidden md:flex">
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
    );
  }

  // Mobile sidebar (drawer)
  return (
    <div
      className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ${open ? '' : 'pointer-events-none'}`}
      aria-hidden={!open}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      {/* Drawer */}
      <aside
        className={`absolute top-0 left-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col py-8 px-4 shadow-xl transform transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <button
          className="mb-8 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="Close menu"
          onClick={onClose}
        >
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <nav className="flex-1 flex flex-col gap-2">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="px-3 py-2 rounded hover:bg-gray-100 text-gray-800 font-medium"
              onClick={onClose}
            >
              {item.label}
            </Link>
          ))}
          <button
            onClick={async () => {
              await signOut({ redirect: false });
              router.push('/');
              onClose && onClose();
            }}
            className="px-3 py-2 rounded hover:bg-gray-100 text-gray-800 font-medium text-left cursor-pointer mt-2"
          >
            Log out
          </button>
        </nav>
      </aside>
    </div>
  );
};

export default Sidebar; 