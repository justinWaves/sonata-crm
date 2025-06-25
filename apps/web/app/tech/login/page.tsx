'use client';
import Header from '@/components/Header';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { signIn } from 'next-auth/react';
import Card from '@/components/Card';

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
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });
    if (result?.ok) {
      router.push('/tech/dashboard');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 mb-4 flex items-center justify-center">
            <Image src="/sonata-logo.svg" alt="Sonata Logo" width={48} height={48} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Log In</h1>
          <p className="text-base text-gray-500">Sign in to your account</p>
        </div>
        <Card className="w-full max-w-sm flex flex-col items-center p-8 rounded-2xl shadow-xl">
          {step === 'email' && (
            <form className="w-full space-y-5" onSubmit={handleEmailSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-700">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base bg-gray-50"
                  placeholder="Your email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              {error && <div className="text-red-600 text-sm text-center">{error}</div>}
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold text-base shadow hover:bg-blue-700 transition">Continue</button>
            </form>
          )}
          {step === 'password' && (
            <form className="w-full space-y-5" onSubmit={handlePasswordSubmit}>
              <div className="mb-2 text-gray-700 text-base font-medium text-center">{email}</div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2 text-gray-700">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base bg-gray-50"
                  placeholder="Your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <div className="text-red-600 text-sm text-center">{error}</div>}
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold text-base shadow hover:bg-blue-700 transition">Sign in</button>
              <button type="button" className="w-full text-blue-600 underline text-sm mt-2 cursor-pointer" onClick={() => { setStep('email'); setPassword(''); setError(''); }}>Go back</button>
            </form>
          )}
          <div className="mt-8 text-center text-gray-500 text-base">
            Don&apos;t have an account?{' '}
            <span className="text-blue-600 font-semibold underline cursor-pointer" onClick={() => router.push('/tech/sign-up')}>Sign Up</span>
          </div>
        </Card>
      </div>
    </>
  );
} 