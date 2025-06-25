'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Card from '@/components/Card';

export default function TechSignUpPage() {
  const router = useRouter();
  const [step, setStep] = useState<'info' | 'password'>('info');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email) {
      setError('Please fill out all fields.');
      return;
    }
    setError('');
    setStep('password');
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('Please create a password.');
      return;
    }
    setError('');
    // Simulate successful sign up
    router.push('/tech/dashboard');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12">
      <div className="flex flex-col items-center mb-6">
        <div className="w-12 h-12 mb-4 flex items-center justify-center">
          <Image src="/sonata-logo.svg" alt="Sonata Logo" width={48} height={48} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Sign Up</h1>
        <p className="text-base text-gray-500">Create your account</p>
      </div>
      <Card className="w-full max-w-sm flex flex-col items-center p-8 rounded-2xl shadow-xl">
        {step === 'info' && (
          <form className="w-full space-y-5" onSubmit={handleInfoSubmit}>
            <div className="flex gap-2">
              <div className="w-1/2">
                <label htmlFor="firstName" className="block text-sm font-medium mb-2 text-gray-700">First name</label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base bg-gray-50"
                  placeholder="Your first name"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="w-1/2">
                <label htmlFor="lastName" className="block text-sm font-medium mb-2 text-gray-700">Last name</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base bg-gray-50"
                  placeholder="Your last name"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>
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
                autoComplete="new-password"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base bg-gray-50"
                placeholder="Create a password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className="text-red-600 text-sm text-center">{error}</div>}
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold text-base shadow hover:bg-blue-700 transition">Continue</button>
            <button type="button" className="w-full text-blue-600 underline text-sm mt-2 cursor-pointer" onClick={() => { setStep('info'); setPassword(''); setError(''); }}>Go back</button>
          </form>
        )}
        <div className="mt-8 text-center text-gray-500 text-base">
          Already have an account?{' '}
          <span className="text-blue-600 font-semibold underline cursor-pointer" onClick={() => router.push('/tech/login')}>Sign in</span>
        </div>
      </Card>
    </div>
  );
} 