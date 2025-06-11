import Link from 'next/link';
import Logo from './Logo';

export default function Header() {
  return (
    <Link href="/">
    <header className="w-full flex items-center px-8 py-4 border-b border-gray-200 bg-white">
      <Logo className="mr-3" width={180} height={180} />
    </header>
    </Link>
  );
} 