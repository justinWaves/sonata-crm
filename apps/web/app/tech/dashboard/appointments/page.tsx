'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';

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
  serviceType: {
    name: string;
    duration: string;
  };
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg text-gray-600">Loading appointments...</div>
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
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Location</th>
              <th className="text-right py-4 px-6 text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-500">
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