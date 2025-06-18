'use client';
import Header from '@/components/Header';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { signIn } from 'next-auth/react';

export default function TechLoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<'email' | 'password'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    setError('');
    setStep('password');
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('Please enter your password.');
      return;
    }
    setError('');
    // Use next-auth signIn
    console.log('Attempting to sign in with:', { email, password });
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });
    console.log('Sign in result:', result);
    if (result?.ok) {
      router.push('/tech/dashboard');
    } else {
      console.error('Sign in failed:', result);
      setError('Invalid email or password');
    }
  };

  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center bg-gray-50 min-h-[calc(100vh-212px)]">
        <div className="flex flex-col items-center mb-4">
          <div className="w-14 h-14 mb-6 flex items-center justify-center">
            <Image src="/sonata-logo.svg" alt="Sonata Logo" width={56} height={56} />
          </div>
          <h1 className="text-2xl font-bold mb-4">Technicians Log In</h1>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm flex flex-col items-center">
          {step === 'email' && (
            <form className="w-full space-y-4" onSubmit={handleEmailSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="input w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              {error && <div className="text-red-600 text-sm">{error}</div>}
              <button type="submit" className="btn w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition cursor-pointer">Continue</button>
            </form>
          )}
          {step === 'password' && (
            <form className="w-full space-y-4" onSubmit={handlePasswordSubmit}>
              <div className="mb-2 text-gray-700 text-sm">{email}</div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  className="input w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <div className="text-red-600 text-sm">{error}</div>}
              <button type="submit" className="btn w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition cursor-pointer">Sign in</button>
              <button type="button" className="w-full text-blue-600 underline text-sm mt-2 cursor-pointer" onClick={() => { setStep('email'); setPassword(''); setError(''); }}>Go back</button>
            </form>
          )}
          <div className="mt-8 text-center text-gray-700 text-sm">
            Don&apos;t have an account?{' '}
            <span className="text-blue-600 font-semibold underline cursor-pointer" onClick={() => router.push('/tech/sign-up')}>Sign Up</span>
          </div>
        </div>
      </div>
    </>
  );
} 