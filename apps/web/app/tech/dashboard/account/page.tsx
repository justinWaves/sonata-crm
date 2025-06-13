"use client";
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

interface TechnicianProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  websiteURL?: string;
  customMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AccountPage() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<TechnicianProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Always call useState at the top level
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    websiteURL: '',
  });

  // Fetch profile
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      fetch('/api/technician', { credentials: 'include' })
        .then(res => res.json())
        .then(data => {
          setProfile(data);
          setLoading(false);
        });
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [session, status]);

  // Sync form state to profile when loaded
  useEffect(() => {
    if (profile) {
      setForm({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        phone: profile.phone,
        websiteURL: profile.websiteURL || '',
      });
    }
  }, [profile]);

  // Track if any field has changed
  const isChanged =
    form.firstName !== (profile?.firstName || '') ||
    form.lastName !== (profile?.lastName || '') ||
    form.email !== (profile?.email || '') ||
    form.phone !== (profile?.phone || '') ||
    form.websiteURL !== (profile?.websiteURL || '');

  if (status === 'loading' || loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (status === 'unauthenticated' || !session?.user?.id) {
    return <div className="p-8">You must be logged in to view this page.</div>;
  }

  if (!profile) {
    return <div className="p-8">Unable to load profile.</div>;
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Account</h2>
      <div className="bg-white rounded shadow p-6 max-w-md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">First Name</label>
            <input
              className="border rounded px-3 py-2 bg-gray-50 w-full"
              value={form.firstName}
              onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Last Name</label>
            <input
              className="border rounded px-3 py-2 bg-gray-50 w-full"
              value={form.lastName}
              onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <input
              className="border rounded px-3 py-2 bg-gray-50 w-full"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Phone</label>
            <input
              className="border rounded px-3 py-2 bg-gray-50 w-full"
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Website URL</label>
            <input
              className="border rounded px-3 py-2 bg-gray-50 w-full"
              value={form.websiteURL}
              onChange={e => setForm(f => ({ ...f, websiteURL: e.target.value }))}
              placeholder="—"
            />
          </div>
        </div>
        <div className="flex gap-4 mt-8">
          <button className="w-1/2 border border-gray-300 rounded py-2 hover:bg-gray-50 transition cursor-pointer" disabled>Change Password</button>
          <button
            className={`w-1/2 rounded py-2 transition cursor-pointer ${isChanged ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
            disabled={!isChanged}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
} 