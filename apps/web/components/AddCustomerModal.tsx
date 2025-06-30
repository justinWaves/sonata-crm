'use client';

import React, { useState } from 'react';
import Modal from './Modal';
import { AddPianoModal } from './AddPianoModal';

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  companyName?: string;
  email?: string;
  phone: string;
  address: string;
  city?: string;
  state?: string;
  zipCode?: string;
  textUpdates?: boolean;
  emailUpdates?: boolean;
}

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (customer: Customer) => void;
  initialValues?: Partial<Omit<Customer, 'id'>>;
  editingCustomerId?: string;
}

export const AddCustomerModal: React.FC<AddCustomerModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialValues = {},
  editingCustomerId,
}) => {
  const [form, setForm] = useState({
    firstName: initialValues.firstName || '',
    lastName: initialValues.lastName || '',
    companyName: initialValues.companyName || '',
    email: initialValues.email || '',
    phone: initialValues.phone || '',
    address: initialValues.address || '',
    city: initialValues.city || '',
    state: initialValues.state || '',
    zipCode: initialValues.zipCode || '',
    textUpdates: initialValues.textUpdates || false,
    emailUpdates: initialValues.emailUpdates || false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pianos, setPianos] = useState<any[]>([]);
  const [isAddPianoModalOpen, setIsAddPianoModalOpen] = useState(false);

  // Store initial form for dirty check
  const initialForm = React.useRef(form);
  React.useEffect(() => {
    if (isOpen) {
      setForm({
        firstName: initialValues.firstName || '',
        lastName: initialValues.lastName || '',
        companyName: initialValues.companyName || '',
        email: initialValues.email || '',
        phone: initialValues.phone || '',
        address: initialValues.address || '',
        city: initialValues.city || '',
        state: initialValues.state || '',
        zipCode: initialValues.zipCode || '',
        textUpdates: initialValues.textUpdates || false,
        emailUpdates: initialValues.emailUpdates || false,
      });
      initialForm.current = {
        firstName: initialValues.firstName || '',
        lastName: initialValues.lastName || '',
        companyName: initialValues.companyName || '',
        email: initialValues.email || '',
        phone: initialValues.phone || '',
        address: initialValues.address || '',
        city: initialValues.city || '',
        state: initialValues.state || '',
        zipCode: initialValues.zipCode || '',
        textUpdates: initialValues.textUpdates || false,
        emailUpdates: initialValues.emailUpdates || false,
      };
    }
    // eslint-disable-next-line
  }, [isOpen, editingCustomerId]);

  const isDirty = Object.keys(form).some(
    (key) => (form as any)[key] !== (initialForm.current as any)[key]
  );

  const handleInputChange = (field: string, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!form.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!form.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!form.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!form.address.trim()) newErrors.address = 'Address is required';
    if (form.email && !/^[^\s@]+@[^-\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Please enter a valid email address';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const requiredFieldsFilled = form.firstName.trim() && form.lastName.trim() && form.phone.trim() && form.address.trim();

  const handleSave = async () => {
    if (!validateForm()) {
      setErrors(prev => ({ ...prev, form: 'Please fill out all required fields.' }));
      return;
    }
    if (editingCustomerId) {
      // Edit mode: PUT request
      const response = await fetch('/api/customers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, id: editingCustomerId }),
      });
      if (!response.ok) {
        const data = await response.json();
        setErrors({ form: data.error || 'Failed to update customer' });
        return;
      }
      const updatedCustomer = await response.json();
      setErrors({});
      onSave(updatedCustomer);
      return;
    }
    // Add mode: POST request
    const response = await fetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (!response.ok) {
      const data = await response.json();
      setErrors({ form: data.error || 'Failed to add customer' });
      return;
    }
    const newCustomer = await response.json();
    // 2. Create pianos for this customer
    for (const piano of pianos) {
      await fetch('/api/pianos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...piano, customerId: newCustomer.id }),
      });
    }
    setForm({
      firstName: '', lastName: '', companyName: '', email: '', phone: '', address: '', city: '', state: '', zipCode: '', textUpdates: false, emailUpdates: false,
    });
    setPianos([]);
    setErrors({});
    onSave(newCustomer);
  };

  const handleClose = () => {
    setForm({
      firstName: '',
      lastName: '',
      companyName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      textUpdates: false,
      emailUpdates: false,
    });
    setPianos([]);
    setErrors({});
    onClose();
  };

  const handleAddPiano = (piano: any) => {
    setPianos(prev => [...prev, piano]);
    setIsAddPianoModalOpen(false);
  };

  const handleRemovePiano = (idx: number) => {
    setPianos(prev => prev.filter((_, i) => i !== idx));
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={editingCustomerId ? 'Edit Customer' : 'Add New Customer'} widthClass="max-w-2xl">
      <div className="space-y-4 max-h-[80vh] overflow-y-auto px-4">
        <div className="flex flex-col md:flex-row gap-2">
          <div className="w-full md:w-1/2">
            <label className="block text-sm font-medium mb-1 text-gray-700">First Name</label>
            <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.firstName} onChange={e => handleInputChange('firstName', e.target.value)} />
            {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
          </div>
          <div className="w-full md:w-1/2">
            <label className="block text-sm font-medium mb-1 text-gray-700">Last Name</label>
            <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.lastName} onChange={e => handleInputChange('lastName', e.target.value)} />
            {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Company (optional)</label>
          <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.companyName} onChange={e => handleInputChange('companyName', e.target.value)} />
        </div>
        <div className="flex flex-col md:flex-row gap-2">
          <div className="w-full md:w-1/2">
            <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
            <input type="email" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.email} onChange={e => handleInputChange('email', e.target.value)} />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>
          <div className="w-full md:w-1/2">
            <label className="block text-sm font-medium mb-1 text-gray-700">Phone</label>
            <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.phone} onChange={e => handleInputChange('phone', e.target.value)} />
            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-2">
          <div className="w-full md:w-1/2">
            <label className="block text-sm font-medium mb-1 text-gray-700">Address</label>
            <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.address} onChange={e => handleInputChange('address', e.target.value)} />
            {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
          </div>
          <div className="w-full md:w-1/2 flex flex-col md:flex-row gap-2">
            <div className="w-full md:w-1/3">
              <label className="block text-sm font-medium mb-1 text-gray-700">City</label>
              <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.city} onChange={e => handleInputChange('city', e.target.value)} />
            </div>
            <div className="w-full md:w-1/3">
              <label className="block text-sm font-medium mb-1 text-gray-700">State</label>
              <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.state} onChange={e => handleInputChange('state', e.target.value)} />
            </div>
            <div className="w-full md:w-1/3">
              <label className="block text-sm font-medium mb-1 text-gray-700">Zip Code</label>
              <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.zipCode} onChange={e => handleInputChange('zipCode', e.target.value)} />
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <label className="flex items-center text-sm text-gray-700">
            <input type="checkbox" className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked={form.textUpdates} onChange={e => handleInputChange('textUpdates', e.target.checked)} />
            Text Updates
          </label>
          <label className="flex items-center text-sm text-gray-700">
            <input type="checkbox" className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked={form.emailUpdates} onChange={e => handleInputChange('emailUpdates', e.target.checked)} />
            Email Updates
          </label>
        </div>
        {/* Pianos Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-md font-semibold text-gray-900">Pianos</h4>
            <button
              type="button"
              onClick={() => setIsAddPianoModalOpen(true)}
              className="px-3 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 text-sm font-medium"
            >
              + Add Piano
            </button>
          </div>
          {pianos.length === 0 ? (
            <p className="text-gray-500 text-center py-2">No pianos added yet</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {pianos.map((piano, idx) => (
                <li key={idx} className="py-2 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{piano.type} {piano.brand && `- ${piano.brand}`}{piano.model && ` ${piano.model}`}{piano.year && ` (${piano.year})`}</div>
                    <div className="text-xs text-gray-500">Serial: {piano.serialNumber || 'N/A'}</div>
                    <div className="text-xs text-gray-500">Last Service: {piano.lastServiceDate ? new Date(piano.lastServiceDate).toLocaleDateString() : 'Never'}</div>
                    {piano.notes && <div className="text-xs text-gray-400 mt-1">{piano.notes}</div>}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemovePiano(idx)}
                    className="text-red-500 hover:underline text-xs ml-2"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <AddPianoModal
        isOpen={isAddPianoModalOpen}
        onClose={() => setIsAddPianoModalOpen(false)}
        onSave={handleAddPiano}
      />
      <div className="flex justify-end space-x-2 pt-2">
        {errors.form && <div className="text-red-600 text-sm flex-1 flex items-center">{errors.form}</div>}
        <button
          type="button"
          onClick={handleClose}
          className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={editingCustomerId ? !isDirty || !requiredFieldsFilled : !requiredFieldsFilled}
        >
          {editingCustomerId ? 'Save Changes' : 'Save'}
        </button>
      </div>
    </Modal>
  );
}; 