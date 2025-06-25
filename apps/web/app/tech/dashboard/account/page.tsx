"use client";
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import ChangePasswordModal from '@/components/ChangePasswordModal';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';

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
    return (
      <div className="space-y-6">
        {/* Profile Settings Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="space-y-8">
            <div>
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
              <div>
                <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>

            {/* Email & Phone Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="h-4 bg-gray-200 rounded w-12 mb-2"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              </div>
              <div>
                <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>

            {/* Address Field */}
            <div>
              <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>

            {/* City, State, ZIP Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="h-4 bg-gray-200 rounded w-8 mb-2"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
              <div>
                <div className="h-4 bg-gray-200 rounded w-12 mb-2"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
              <div>
                <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>

            {/* Company & Website Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
              <div>
                <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>

            {/* Timezone & Currency Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
              <div>
                <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4">
              <div className="h-10 bg-gray-200 rounded w-32"></div>
              <div className="h-10 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        </div>

        {/* Billing Section Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="space-y-8">
            <div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>

            <div className="space-y-6">
              {/* Current Plan */}
              <div className="p-6 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="h-5 bg-gray-200 rounded w-32 mb-1"></div>
                    <div className="h-4 bg-gray-200 rounded w-40"></div>
                  </div>
                  <div className="h-10 bg-gray-200 rounded w-24"></div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="p-6 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="h-5 bg-gray-200 rounded w-28 mb-1"></div>
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                  </div>
                  <div className="h-10 bg-gray-200 rounded w-16"></div>
                </div>
              </div>

              {/* Billing History */}
              <div>
                <div className="h-5 bg-gray-200 rounded w-24 mb-4"></div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated' || !session?.user?.id) {
    return (
          <Card className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
              <p className="text-base text-gray-500">You must be logged in to view this page.</p>
            </div>
          </Card>
    );
  }

  if (!profile) {
    return (
          <Card className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
              <p className="text-base text-gray-500">Unable to load profile.</p>
            </div>
          </Card>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Profile Settings */}
        <Card className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Settings</h2>
              <p className="text-base text-gray-500">Manage your personal information and preferences</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <Input 
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <Input 
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <Input 
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <Input 
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <Input 
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <Input 
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <Input 
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                <Input 
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <Input 
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="websiteURL" className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
                <Input 
                  id="websiteURL"
                  name="websiteURL"
                  value={formData.websiteURL}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                <select
                  id="timezone"
                  name="timezone"
                  value={formData.timezone}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/New_York">Eastern Time</option>
                </select>
              </div>
              <div>
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                <select
                  id="currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="USD">USD ($)</option>
                  <option value="CAD">CAD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                onClick={() => setIsPasswordModalOpen(true)}
                variant="secondary"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Change Password
              </Button>
              <Button
                type="submit"
                disabled={!isChanged || isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Card>

        {/* Billing Section */}
        <Card className="bg-white rounded-2xl shadow-xl p-8">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Billing & Subscription</h2>
              <p className="text-base text-gray-500">Manage your subscription and billing information</p>
            </div>

            <div className="space-y-6">
              {/* Current Plan */}
              <div className="p-6 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Professional Plan</h3>
                    <p className="text-sm text-gray-500">$49/month • Unlimited appointments</p>
                  </div>
                  <Button
                    variant="secondary"
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Change Plan
                  </Button>
                </div>
              </div>

              {/* Payment Method */}
              <div className="p-6 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Payment Method</h3>
                    <p className="text-sm text-gray-500">•••• •••• •••• 4242</p>
                  </div>
                  <Button
                    variant="secondary"
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Update
                  </Button>
                </div>
              </div>

              {/* Billing History */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Billing History</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">March 2024</p>
                      <p className="text-sm text-gray-500">Professional Plan</p>
                    </div>
                    <div className="text-sm font-medium text-gray-900">$49.00</div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">February 2024</p>
                      <p className="text-sm text-gray-500">Professional Plan</p>
                    </div>
                    <div className="text-sm font-medium text-gray-900">$49.00</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </>
  );
} 