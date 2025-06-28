'use client';

import React, { useState, useEffect, useRef } from 'react';
import Modal from './Modal';
import Input from './Input';
import Button from './Button';
import { AddPianoModal } from './AddPianoModal';
import { toast } from 'react-hot-toast';

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  email?: string;
}

interface Piano {
  id: string;
  type: string;
  brand?: string;
  model?: string;
  year?: number;
}

interface ServiceType {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: number;
  durationMinutes: number;
  bufferMinutes: number;
  serviceType: string;
  serviceTypeColor: string;
}

interface AddAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (appointment: {
    id?: string;
    customerId: string;
    pianoId?: string;
    serviceTypeId: string;
    scheduledAt: string;
    notes?: string;
  }) => void;
  preSelectedCustomerId?: string;
  editingAppointment?: {
    id: string;
    customerId: string;
    pianoId?: string;
    serviceTypeId?: string;
    scheduledAt: string;
    notes?: string;
  };
}

export const AddAppointmentModal: React.FC<AddAppointmentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  preSelectedCustomerId,
  editingAppointment,
}) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [pianos, setPianos] = useState<Piano[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(preSelectedCustomerId || '');
  const [selectedPianoId, setSelectedPianoId] = useState('');
  const [selectedServiceTypeId, setSelectedServiceTypeId] = useState('');
  const [scheduledDate, setScheduledDate] = useState<string>('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [notes, setNotes] = useState('');
  const [isAddPianoModalOpen, setIsAddPianoModalOpen] = useState(false);
  const initialValuesRef = useRef<any>(null);
  const today = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(today.getFullYear() + 5);
  const [dateError, setDateError] = useState('');

  const isEditing = !!editingAppointment;

  // Set initial values ref when modal opens in edit mode
  useEffect(() => {
    if (isOpen && editingAppointment) {
      initialValuesRef.current = {
        customerId: editingAppointment.customerId,
        pianoId: editingAppointment.pianoId || '',
        serviceTypeId: editingAppointment.serviceTypeId || '',
        scheduledDate: editingAppointment.scheduledAt ? new Date(editingAppointment.scheduledAt).toISOString().split('T')[0] : '',
        scheduledTime: editingAppointment.scheduledAt ? new Date(editingAppointment.scheduledAt).toLocaleTimeString('en-US', { hour12: false }).slice(0, 5) : '',
        notes: editingAppointment.notes || '',
      };
    }
    if (isOpen && !editingAppointment) {
      initialValuesRef.current = null;
    }
  }, [isOpen, editingAppointment]);

  // Dirty check
  const isDirty = editingAppointment ? (
    selectedCustomerId !== initialValuesRef.current?.customerId ||
    selectedPianoId !== initialValuesRef.current?.pianoId ||
    selectedServiceTypeId !== initialValuesRef.current?.serviceTypeId ||
    scheduledDate !== initialValuesRef.current?.scheduledDate ||
    scheduledTime !== initialValuesRef.current?.scheduledTime ||
    notes !== initialValuesRef.current?.notes
  ) : true;

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      if (editingAppointment) {
        // Editing mode - populate with existing data
        setSelectedCustomerId(editingAppointment.customerId);
        setSelectedPianoId(editingAppointment.pianoId || '');
        setSelectedServiceTypeId(editingAppointment.serviceTypeId || '');
        setNotes(editingAppointment.notes || '');
        
        const appointmentDate = editingAppointment.scheduledAt ? new Date(editingAppointment.scheduledAt) : undefined;
        setScheduledDate(appointmentDate && !isNaN(appointmentDate.getTime()) ? String(appointmentDate.toISOString().split('T')[0]) : '');
        setScheduledTime(appointmentDate && !isNaN(appointmentDate.getTime()) ? String(appointmentDate.toLocaleTimeString('en-US', { hour12: false }).slice(0, 5)) : '');
      } else {
        // Adding mode - reset form
        setSelectedCustomerId(preSelectedCustomerId || '');
        setSelectedPianoId('');
        setSelectedServiceTypeId('');
        setScheduledDate('');
        setScheduledTime('');
        setNotes('');
      }
      fetchCustomers();
      fetchServiceTypes();
    }
  }, [isOpen, preSelectedCustomerId, editingAppointment]);

  // Fetch customer's pianos when customer changes
  useEffect(() => {
    if (selectedCustomerId) {
      fetchPianos(selectedCustomerId);
    } else {
      setPianos([]);
      setSelectedPianoId('');
    }
  }, [selectedCustomerId]);

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers');
      if (!response.ok) throw new Error('Failed to fetch customers');
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const fetchServiceTypes = async () => {
    try {
      const response = await fetch('/api/service-types');
      if (!response.ok) throw new Error('Failed to fetch service types');
      const data = await response.json();
      setServiceTypes(data);
    } catch (error) {
      console.error('Error fetching service types:', error);
    }
  };

  const fetchPianos = async (customerId: string) => {
    try {
      const response = await fetch(`/api/pianos?customerId=${customerId}`);
      if (!response.ok) throw new Error('Failed to fetch pianos');
      const data = await response.json();
      setPianos(data);
      return data;
    } catch (error) {
      console.error('Error fetching pianos:', error);
      return [];
    }
  };

  const handleAddPiano = async (pianoData: any) => {
    try {
      const response = await fetch('/api/pianos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...pianoData, customerId: selectedCustomerId }),
      });
      if (!response.ok) throw new Error('Failed to add piano');
      setIsAddPianoModalOpen(false);
      // Refresh pianos and select the new one
      const updatedPianos = await fetchPianos(selectedCustomerId);
      if (updatedPianos && updatedPianos.length > 0) {
        setSelectedPianoId(updatedPianos[updatedPianos.length - 1].id);
      }
    } catch (error) {
      console.error('Error adding piano:', error);
    }
  };

  const isDateValid = (() => {
    if (!scheduledDate) return false;
    const dateString = typeof scheduledDate === 'string' ? scheduledDate : '';
    const d = new Date(dateString);
    const todayString = today.toISOString().split('T')[0] || '';
    const todayDate = new Date(todayString);
    return d >= todayDate && d <= maxDate;
  })();

  const handleSave = () => {
    if (!selectedCustomerId || !selectedServiceTypeId || !scheduledDate || !scheduledTime) {
      return; // TODO: Add proper validation and error messages
    }
    if (!isDateValid) {
      setDateError('Please select a valid date within the next 5 years.');
      toast.error('Please select a valid date within the next 5 years.');
      return;
    }
    setDateError('');
    const scheduledAt = new Date(`${scheduledDate}T${scheduledTime}`).toISOString();
    onSave({
      id: editingAppointment?.id,
      customerId: selectedCustomerId,
      pianoId: selectedPianoId || undefined,
      serviceTypeId: selectedServiceTypeId,
      scheduledAt,
      notes: notes || undefined,
    });
  };

  const selectedServiceType = serviceTypes.find(st => st.id === selectedServiceTypeId);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingAppointment ? "Edit Appointment" : "Add New Appointment"} widthClass="max-w-2xl">
      <div className="space-y-6">
        {/* Customer Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Customer *
          </label>
          <select
            value={selectedCustomerId}
            onChange={(e) => setSelectedCustomerId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a customer</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.firstName} {customer.lastName} - {customer.address}
              </option>
            ))}
          </select>
        </div>

        {/* Piano Selection */}
        {selectedCustomerId && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Piano (Optional)
            </label>
            <select
              value={selectedPianoId}
              onChange={(e) => setSelectedPianoId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">No specific piano</option>
              {pianos.map((piano) => (
                <option key={piano.id} value={piano.id}>
                  {piano.brand} {piano.model} ({piano.type}) {piano.year ? `- ${piano.year}` : ''}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="mt-2 px-3 py-2 rounded bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 text-sm font-medium"
              onClick={() => setIsAddPianoModalOpen(true)}
            >
              + Add Piano
            </button>
          </div>
        )}
        <AddPianoModal
          isOpen={isAddPianoModalOpen}
          onClose={() => setIsAddPianoModalOpen(false)}
          onSave={handleAddPiano}
        />

        {/* Service Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Service Type *
          </label>
          <select
            value={selectedServiceTypeId}
            onChange={(e) => setSelectedServiceTypeId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a service type</option>
            {serviceTypes.map((serviceType) => (
              <option key={serviceType.id} value={serviceType.id}>
                {serviceType.name} - ${serviceType.price} ({serviceType.duration})
              </option>
            ))}
          </select>
        </div>

        {/* Date and Time Selection */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date *
            </label>
            <input
              type="date"
              value={scheduledDate}
              onChange={(e) => {
                setScheduledDate(e.target.value);
                setDateError('');
              }}
              min={today.toISOString().split('T')[0]}
              max={maxDate.toISOString().split('T')[0]}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {dateError && <p className="text-red-600 text-sm mt-1">{dateError}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time *
            </label>
            <input
              type="time"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Any additional notes about this appointment..."
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4 mt-4">
        <Button
          variant="secondary"
          onClick={onClose}
          className="px-4 py-2"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={
            (!isEditing && (!selectedCustomerId || !selectedServiceTypeId || !scheduledDate || !scheduledTime)) ||
            (isEditing && (!isDirty || !selectedCustomerId || !selectedServiceTypeId || !scheduledDate || !scheduledTime))
          }
          className="px-4 py-2"
        >
          {isEditing ? 'Update Appointment' : 'Create Appointment'}
        </Button>
      </div>
    </Modal>
  );
}; 