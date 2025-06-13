// apps/web/app/page.tsx
'use client';

import Logo from '@/components/Logo';
import Header from '@/components/Header';

export default function Home() {
  return (
    <>
      <Header showTechLogin={true} />
      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-212px)] bg-gray-50">
        <Logo className="mb-6" width={500} />
        <p className="text-xl text-gray-600 mb-8 text-center max-w-xl">Modern booking and management for piano technicians and their customers.</p>
        <div className="flex gap-4">
          <a href="/tech/sign-up" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition cursor-pointer">Sign Up</a>
          <a href="/customer/book" className="bg-white border border-black text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition cursor-pointer">View Demo</a>
        </div>
    </main>
    </>
  );
}
