'use client';
import { useRouter } from 'next/navigation';

export default function TechLoginPage() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Technician Login</h1>
      <form
        className="bg-white p-8 rounded shadow-md w-full max-w-sm space-y-4"
        onSubmit={e => {
          e.preventDefault();
          router.push('/tech/dashboard');
        }}
      >
        <input name="email" placeholder="Email" className="input w-full" />
        <input name="password" type="password" placeholder="Password" className="input w-full" />
        <button type="submit" className="btn w-full">Login</button>
      </form>
    </div>
  );
} 