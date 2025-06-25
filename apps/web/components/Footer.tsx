import Logo from './Logo';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Pricing', href: '/#pricing' },
  { name: 'Book', href: '/customer/book' },
  { name: 'Log In', href: '/tech/login' },
  { name: 'Contact', href: 'mailto:info@sonatacrm.com' },
];

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 bg-gray-50 py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3 mb-4 md:mb-0">
          <Logo width={120} />
        </div>
        <nav className="flex flex-wrap gap-6 text-gray-500 text-sm font-medium">
          {navLinks.map(link => (
            <a key={link.name} href={link.href} className="hover:text-blue-600 hover:underline transition">
              {link.name}
            </a>
          ))}
        </nav>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
        <div>&copy; {new Date().getFullYear()} Sonata CRM. All rights reserved.</div>
        <div className="flex gap-4">
          <a href="/privacy" className="hover:text-blue-600 hover:underline">Privacy Policy</a>
          <a href="/terms" className="hover:text-blue-600 hover:underline">Terms of Service</a>
        </div>
        <div>Built by <a href="https://sonatacrm.com" className="hover:text-blue-600 hover:underline">Sonata Team</a></div>
      </div>
    </footer>
  );
} 