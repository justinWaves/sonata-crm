import Link from 'next/link';
import Logo from './Logo';

export default function Header({ showTechLogin, onMenuClick }: { showTechLogin?: boolean; onMenuClick?: () => void }) {
  return (
    <header className="w-screen fixed top-0 left-0 z-50 flex items-center px-8 py-4 border-b border-gray-200 bg-white h-[56px]">
      {/* Hamburger menu button for mobile */}
      <button
        className="block md:hidden mr-3 focus:outline-none"
        aria-label="Open menu"
        onClick={onMenuClick}
      >
        <svg className="h-7 w-7 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      {/* Logo centered on mobile, left on md+ */}
      <div className="flex-1 flex justify-center md:justify-start">
        <Link href="/">
          <Logo className="mr-3" width={180} height={180} />
        </Link>
      </div>
      {showTechLogin && (
        <Link href="/tech/login">
          <button className="bg-white border border-gray-500 text-gray-500 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition cursor-pointer">
            Technician Login
          </button>
        </Link>
      )}
    </header>
  );
} 