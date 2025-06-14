"use client";
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import ChangePasswordModal from '@/components/ChangePasswordModal';

interface TechnicianProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  websiteURL?: string;
  companyName?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  timezone?: string;
  currency?: string;
  customMessage?: string;
  createdAt: string;
  updatedAt: string;
  address?: string;
}

export default function AccountPage() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<TechnicianProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    websiteURL: '',
    city: '',
    state: '',
    zipCode: '',
    timezone: '',
    currency: '',
    language: 'en',
    notifications: {
      email: true,
      sms: true,
      push: true,
    },
    address: '',
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
      setFormData({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        phone: profile.phone,
        companyName: profile.companyName || '',
        websiteURL: profile.websiteURL || '',
        city: profile.city || '',
        state: profile.state || '',
        zipCode: profile.zipCode || '',
        timezone: profile.timezone || 'America/Los_Angeles',
        currency: profile.currency || 'USD',
        address: profile.address || '',
        language: 'en',
        notifications: {
          email: true,
          sms: true,
          push: true,
        },
      });
    }
  }, [profile]);

  // Track if any field has changed
  const isChanged =
    formData.firstName !== (profile?.firstName || '') ||
    formData.lastName !== (profile?.lastName || '') ||
    formData.email !== (profile?.email || '') ||
    formData.phone !== (profile?.phone || '') ||
    formData.companyName !== (profile?.companyName || '') ||
    formData.websiteURL !== (profile?.websiteURL || '') ||
    formData.city !== (profile?.city || '') ||
    formData.state !== (profile?.state || '') ||
    formData.zipCode !== (profile?.zipCode || '') ||
    formData.timezone !== (profile?.timezone || 'America/Los_Angeles') ||
    formData.currency !== (profile?.currency || 'USD');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        companyName: formData.companyName,
        websiteURL: formData.websiteURL,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        timezone: formData.timezone,
        currency: formData.currency,
        address: formData.address,
      };
      const response = await fetch(`/api/technician`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update settings');
      }
      
      // Update the profile with new data
      setProfile(data);
      toast.success('Settings updated successfully', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#10B981',
          color: '#fff',
          padding: '16px',
          borderRadius: '8px',
        },
      });
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update settings', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#EF4444',
          color: '#fff',
          padding: '16px',
          borderRadius: '8px',
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-2xl p-8 bg-white rounded-2xl shadow-xl flex flex-col items-center">
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Settings</h2>
            <p className="text-base text-gray-500 mb-6">Manage your account settings and preferences</p>
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="firstName" className="block text-lg font-semibold text-gray-900 mb-2">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                required
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-lg font-semibold text-gray-900 mb-2">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-lg font-semibold text-gray-900 mb-2">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                required
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-lg font-semibold text-gray-900 mb-2">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                required
              />
            </div>
          </div>

          {/* Company Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="companyName" className="block text-lg font-semibold text-gray-900 mb-2">Company Name</label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                required
              />
            </div>
            <div>
              <label htmlFor="websiteURL" className="block text-lg font-semibold text-gray-900 mb-2">Company Website</label>
              <input
                type="url"
                id="websiteURL"
                name="websiteURL"
                value={formData.websiteURL}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                placeholder="https://yourcompany.com"
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-lg font-semibold text-gray-900 mb-2">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
              />
            </div>
            <div>
              <label htmlFor="city" className="block text-lg font-semibold text-gray-900 mb-2">City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
              />
            </div>
            <div>
              <label htmlFor="state" className="block text-lg font-semibold text-gray-900 mb-2">State</label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
              />
            </div>
            <div>
              <label htmlFor="zipCode" className="block text-lg font-semibold text-gray-900 mb-2">Zip Code</label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
              />
            </div>
         
          </div>

          {/* Preferences */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="timezone" className="block text-lg font-semibold text-gray-900 mb-2">Timezone</label>
              <select
                id="timezone"
                name="timezone"
                value={formData.timezone}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
              >
                <option value="America/Los_Angeles">Pacific Time</option>
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
              </select>
            </div>
            <div>
              <label htmlFor="currency" className="block text-lg font-semibold text-gray-900 mb-2">Currency</label>
              <select
                id="currency"
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="CAD">CAD ($)</option>
              </select>
            </div>
            {/* Language `*/}
            {/* <div>
              <label htmlFor="language" className="block text-lg font-semibold text-gray-900 mb-2">Language</label>
              <select
                id="language"
                name="language"
                value={formData.language}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div> */}
          </div>

          {/* Notification Settings */}
          {/* <div className="flex flex-col gap-2">
            <label className="block text-lg font-semibold text-gray-900 mb-2">Notification Settings</label>
            <div className="flex flex-row gap-6">
              <label className="flex items-center gap-2 text-base text-gray-700">
                <input
                  type="checkbox"
                  name="notifications.email"
                  checked={formData.notifications.email}
                  onChange={handleInputChange}
                  className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Email
              </label>
              <label className="flex items-center gap-2 text-base text-gray-700">
                <input
                  type="checkbox"
                  name="notifications.sms"
                  checked={formData.notifications.sms}
                  onChange={handleInputChange}
                  className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                SMS
              </label>
              <label className="flex items-center gap-2 text-base text-gray-700">
                <input
                  type="checkbox"
                  name="notifications.push"
                  checked={formData.notifications.push}
                  onChange={handleInputChange}
                  className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Push
              </label>
            </div>
          </div> */}

          <div className="flex flex-col gap-4 mt-2">
            <button
              type="submit"
              disabled={!isChanged || isLoading}
              className={`w-full rounded-lg py-3 text-lg font-bold shadow-sm transition
                ${isChanged && !isLoading ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}
                disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => setIsPasswordModalOpen(true)}
              className="w-full rounded-lg border border-gray-300 bg-white py-3 text-lg font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition"
            >
              Change Password
            </button>
          </div>
        </form>
        <ChangePasswordModal
          isOpen={isPasswordModalOpen}
          onClose={() => setIsPasswordModalOpen(false)}
        />
      </div>
    </div>
  );
} 