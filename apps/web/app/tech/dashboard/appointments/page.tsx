'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { AddAppointmentModal } from '@/components/AddAppointmentModal';
import { CustomerSelectionModal } from '@/components/CustomerSelectionModal';
import { AddCustomerModal } from '@/components/AddCustomerModal';
import Modal from '@/components/Modal';

interface ServiceType {
  id: string;
  name: string;
  duration: string;
  serviceType: string;
  serviceTypeColor: string;
  price: string;
}

interface Appointment {
  id: string;
  customerId: string;
  scheduledAt: string;
  timeSlot: {
    startTime: string;
    blockName: string;
  } | null;
  notes: string | null;
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    address: string;
    email?: string;
    phone?: string;
  };
  piano?: {
    id: string;
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
  const [isCustomerSelectionModalOpen, setIsCustomerSelectionModalOpen] = useState(false);
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
  const [isAddAppointmentModalOpen, setIsAddAppointmentModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [deletingAppointment, setDeletingAppointment] = useState<Appointment | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

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

  const handleAddAppointment = async (appointmentData: {
    customerId: string;
    pianoId?: string;
    serviceTypeId: string;
    scheduledAt: string;
    notes?: string;
  }) => {
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create appointment');
      }

      const newAppointment = await response.json();
      setAppointments(prev => [...prev, newAppointment]);
      setIsAddAppointmentModalOpen(false);
      setSelectedCustomerId('');
      toast.success('Appointment created successfully!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create appointment');
    }
  };

  const handleEditAppointment = async (appointmentData: {
    id?: string;
    customerId: string;
    pianoId?: string;
    serviceTypeId: string;
    scheduledAt: string;
    notes?: string;
  }) => {
    if (!appointmentData.id) {
      toast.error('Appointment ID is required for editing');
      return;
    }

    try {
      const response = await fetch('/api/appointments', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update appointment');
      }

      const updatedAppointment = await response.json();
      setAppointments(prev => prev.map(apt => 
        apt.id === appointmentData.id ? updatedAppointment : apt
      ));
      setEditingAppointment(null);
      toast.success('Appointment updated successfully!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update appointment');
    }
  };

  const handleDeleteAppointment = async (appointmentId: string) => {
    try {
      const response = await fetch(`/api/appointments?id=${appointmentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete appointment');
      }

      setAppointments(prev => prev.filter(apt => apt.id !== appointmentId));
      setDeletingAppointment(null);
      toast.success('Appointment deleted successfully!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete appointment');
    }
  };

  const handleExistingCustomerSelected = (customerId: string) => {
    setSelectedCustomerId(customerId);
    setIsCustomerSelectionModalOpen(false);
    setIsAddAppointmentModalOpen(true);
  };

  const handleNewCustomerRequested = () => {
    setIsCustomerSelectionModalOpen(false);
    setIsAddCustomerModalOpen(true);
  };

  const handleCustomerCreated = (newCustomer: { id: string }) => {
    setIsAddCustomerModalOpen(false);
    setSelectedCustomerId(newCustomer.id);
    setIsAddAppointmentModalOpen(true);
    toast.success('Customer created successfully!');
  };

  const handleStartAddAppointment = () => {
    setIsCustomerSelectionModalOpen(true);
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
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-gray-900">Appointments</h2>
          <button
            onClick={handleStartAddAppointment}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add Appointment
          </button>
        </div>
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
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedAppointment(appointment)}
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
                          background: appointment.serviceType.serviceTypeColor + '22',
                          color: getDarkColor(appointment.serviceType.serviceTypeColor),
                          fontSize: '0.88rem',
                          padding: '0.10rem 0.55rem',
                          fontWeight: 500,
                        }}
                        className="inline-block text-nowrap rounded-md"
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
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingAppointment(appointment);
                        }}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                        Edit
                          </button>
                          <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingAppointment(appointment);
                        }}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                        Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

      <CustomerSelectionModal
        isOpen={isCustomerSelectionModalOpen}
        onClose={() => setIsCustomerSelectionModalOpen(false)}
        onExistingCustomerSelected={handleExistingCustomerSelected}
        onNewCustomerRequested={handleNewCustomerRequested}
      />

      <AddCustomerModal
        isOpen={isAddCustomerModalOpen}
        onClose={() => setIsAddCustomerModalOpen(false)}
        onSave={handleCustomerCreated}
      />

      <AddAppointmentModal
        key={selectedCustomerId || 'add-appointment'}
        isOpen={isAddAppointmentModalOpen}
        onClose={() => {
          setIsAddAppointmentModalOpen(false);
          setSelectedCustomerId('');
        }}
        onSave={handleAddAppointment}
        preSelectedCustomerId={selectedCustomerId}
      />

      {/* Edit Appointment Modal */}
      {editingAppointment && (
        <AddAppointmentModal
          isOpen={!!editingAppointment}
          onClose={() => setEditingAppointment(null)}
          onSave={handleEditAppointment}
          preSelectedCustomerId={editingAppointment.customerId}
          editingAppointment={{
            id: editingAppointment.id,
            customerId: editingAppointment.customerId,
            pianoId: editingAppointment.piano?.id,
            serviceTypeId: editingAppointment.serviceType.id,
            scheduledAt: editingAppointment.scheduledAt,
            notes: editingAppointment.notes || undefined,
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingAppointment && (
        <Modal isOpen={!!deletingAppointment} onClose={() => setDeletingAppointment(null)} title="Delete Appointment">
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete the appointment for{' '}
            <span className="font-medium">
              {deletingAppointment.customer.firstName} {deletingAppointment.customer.lastName}
            </span>{' '}
            on {formatDate(deletingAppointment.scheduledAt)}?
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setDeletingAppointment(null)}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDeleteAppointment(deletingAppointment.id)}
              className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium shadow-sm hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </Modal>
      )}

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <Modal isOpen={!!selectedAppointment} onClose={() => setSelectedAppointment(null)} title="Appointment Details" widthClass="max-w-lg">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 min-w-[4rem] min-h-[4rem] rounded-full bg-blue-100 flex items-center justify-center text-2xl text-blue-600 font-bold">
              {selectedAppointment.customer.firstName[0]}{selectedAppointment.customer.lastName[0]}
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900">
                {selectedAppointment.customer.firstName} {selectedAppointment.customer.lastName}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {selectedAppointment.customer.address}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {selectedAppointment.customer.email || ''} {selectedAppointment.customer.phone ? `• ${selectedAppointment.customer.phone}` : ''}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <div className="text-xs text-gray-400 font-medium mb-1">Service</div>
              <div className="font-medium text-gray-900">{selectedAppointment.serviceType.name}</div>
              <div className="text-xs text-gray-500 mt-1">{selectedAppointment.serviceType.duration} • ${selectedAppointment.serviceType.price}</div>
              <div className="mt-2">
                {selectedAppointment.serviceType.serviceType && (
                  <span
                    style={{
                      background: selectedAppointment.serviceType.serviceTypeColor + '22',
                      color: getDarkColor(selectedAppointment.serviceType.serviceTypeColor),
                      fontSize: '0.88rem',
                      padding: '0.10rem 0.55rem',
                      fontWeight: 500,
                    }}
                    className="inline-block text-nowrap rounded-md"
                  >
                    {selectedAppointment.serviceType.serviceType}
                  </span>
                )}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-400 font-medium mb-1">Piano</div>
              <div className="font-medium text-gray-900">
                {selectedAppointment.piano ? `${selectedAppointment.piano.brand || ''} ${selectedAppointment.piano.model || ''} (${selectedAppointment.piano.type})` : 'N/A'}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-400 font-medium mb-1">Date & Time</div>
              <div className="font-medium text-gray-900">{new Date(selectedAppointment.scheduledAt).toLocaleString()}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 font-medium mb-1">Notes</div>
              <div className="text-gray-700 text-sm whitespace-pre-line">{selectedAppointment.notes || 'None'}</div>
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={() => setSelectedAppointment(null)}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                setEditingAppointment(selectedAppointment);
                setSelectedAppointment(null);
              }}
              className="ml-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium shadow-sm hover:bg-blue-700"
            >
              Edit Appointment
            </button>
      </div>
        </Modal>
      )}
    </div>
  );
} 