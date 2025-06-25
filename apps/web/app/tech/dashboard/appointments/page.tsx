'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';

interface ServiceType {
  id: string;
  name: string;
  duration: string;
  serviceType: string;
  serviceTypeColor: string;
}

interface Appointment {
  id: string;
  scheduledAt: string;
  timeSlot: {
    startTime: string;
    blockName: string;
  } | null;
  notes: string | null;
  customer: {
    firstName: string;
    lastName: string;
    address: string;
  };
  piano?: {
    type: string;
    brand: string | null;
    model: string | null;
  };
  serviceType: ServiceType;
}

const colorOptions = [
  { name: 'Purple', value: '#a78bfa', dark: '#6d28d9' },
  { name: 'Green', value: '#34d399', dark: '#059669' },
  { name: 'Yellow', value: '#fbbf24', dark: '#b45309' },
  { name: 'Red', value: '#f87171', dark: '#b91c1c' },
  { name: 'Orange', value: '#fb923c', dark: '#ea580c' },
  { name: 'Violet', value: '#c4b5fd', dark: '#7c3aed' },
  { name: 'Blue', value: '#60a5fa', dark: '#1d4ed8' },
];

function getDarkColor(hex: string) {
  const found = colorOptions.find(opt => opt.value === hex);
  if (found) {
    const dark = found.dark.replace('#', '');
    const r = Math.max(0, parseInt(dark.substring(0, 2), 16) - 32).toString(16).padStart(2, '0');
    const g = Math.max(0, parseInt(dark.substring(2, 4), 16) - 32).toString(16).padStart(2, '0');
    const b = Math.max(0, parseInt(dark.substring(4, 6), 16) - 32).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
  }
  return '#222';
}

export default function AppointmentsPage() {
  const { data: session } = useSession();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      fetchAppointments();
    }
  }, [session]);

  const fetchAppointments = async () => {
    try {
      const response = await fetch('/api/appointments');
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch appointments');
      setAppointments(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Date & Time</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Customer</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Service</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Type</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Location</th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-4 px-6">
                    <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-12"></div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end space-x-3">
                      <div className="h-4 bg-gray-200 rounded w-8"></div>
                      <div className="h-4 bg-gray-200 rounded w-8"></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-end">
          <div className="h-10 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    );
  }

  return (
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Appointments</h2>
            <p className="text-base text-gray-500">View and manage your upcoming appointments</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Date & Time</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Customer</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Service</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Type</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Location</th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">
                      No appointments found
                    </td>
                  </tr>
                ) : (
                  appointments.map((appointment) => (
                    <tr 
                      key={appointment.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="text-sm font-medium text-gray-900">
                          {formatDate(appointment.scheduledAt)}
                        </div>
                        <div className="text-sm text-gray-500">
                      {appointment.timeSlot ? `${appointment.timeSlot.blockName} (${formatTime(appointment.timeSlot.startTime)})` : formatTime(appointment.scheduledAt)}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm font-medium text-gray-900">
                          {appointment.customer.firstName} {appointment.customer.lastName}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm font-medium text-gray-900">
                          {appointment.serviceType.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.serviceType.duration}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                    {appointment.serviceType.serviceType ? (
                      <span
                        style={{
                          background: appointment.serviceType.serviceTypeColor,
                          color: getDarkColor(appointment.serviceType.serviceTypeColor),
                          border: `1px solid ${getDarkColor(appointment.serviceType.serviceTypeColor)}`,
                          fontSize: '0.92rem',
                          padding: '0.18rem 0.7rem',
                          fontWeight: 600,
                        }}
                        className="inline-block text-nowrap rounded-lg"
                      >
                        {appointment.serviceType.serviceType}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500">N/A</span>
                    )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm text-gray-900">
                          {appointment.customer.address}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={() => {/* TODO: Implement view details */}}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            View
                          </button>
                          <button
                            onClick={() => {/* TODO: Implement edit */}}
                            className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                          >
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => {/* TODO: Implement add appointment */}}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add Appointment
            </button>
      </div>
    </div>
  );
} 