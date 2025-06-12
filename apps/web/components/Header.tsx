import Link from 'next/link';
import Logo from './Logo';

export default function Header({ showTechLogin }: { showTechLogin?: boolean }) {
  return (
    <header className="w-full flex items-center px-8 py-4 border-b border-gray-200 bg-white h-[56px]">
      <Link href="/">
        <Logo className="mr-3" width={180} height={180} />
      </Link>
      <div className="flex-1" />
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