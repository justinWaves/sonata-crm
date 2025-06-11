import Link from 'next/link';

const navItems = [
  { label: 'Appointments', href: '#' },
  { label: 'Availability', href: '#' },
  { label: 'Customers', href: '#' },
  { label: 'Services', href: '#' },
  { label: 'Account', href: '#' },
  { label: 'Log out', href: '#' },
];

export default function TechDashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="bg-white rounded shadow p-12 min-w-[400px] text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome, Technician</h1>
        <p className="text-gray-500">Select a section from the sidebar to get started.</p>
      </div>
    </div>
  );
} 