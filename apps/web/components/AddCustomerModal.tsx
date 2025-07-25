'use client';

import React, { useState } from 'react';
import Modal from './Modal';
import { AddPianoModal } from './AddPianoModal';
import { EditPianoModal } from './EditPianoModal';
import type { Piano } from '../types/piano';
import type { Customer } from '../types/customer';
import { HiPencil, HiTrash } from 'react-icons/hi';

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (customer: Customer) => void;
  initialValues?: Partial<Omit<Customer, 'id'>> & { pianos?: Piano[] };
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
  const [pianos, setPianos] = useState<Piano[]>([]);
  const [isAddPianoModalOpen, setIsAddPianoModalOpen] = useState(false);
  const [isEditPianoModalOpen, setIsEditPianoModalOpen] = useState(false);
  const [editPianoIndex, setEditPianoIndex] = useState<number | null>(null);

  // Store initial form for dirty check
  const initialForm = React.useRef(form);
  const initialPianos = React.useRef<Piano[]>([]);
  
  // Memoize initial values to prevent infinite re-renders
  const memoizedInitialValues = React.useMemo(() => ({
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
  }), [initialValues.firstName, initialValues.lastName, initialValues.companyName, initialValues.email, initialValues.phone, initialValues.address, initialValues.city, initialValues.state, initialValues.zipCode, initialValues.textUpdates, initialValues.emailUpdates]);

  React.useEffect(() => {
    if (isOpen) {
      setForm(memoizedInitialValues);
      initialForm.current = memoizedInitialValues;
      const pianosVal = 'pianos' in initialValues && Array.isArray((initialValues as any).pianos) ? (initialValues as any).pianos : [];
      setPianos(pianosVal);
      initialPianos.current = pianosVal;
    }
  }, [isOpen, editingCustomerId, memoizedInitialValues]);

  const isDirty =
    Object.keys(form).some(
      (key) => (form as any)[key] !== (initialForm.current as any)[key]
    ) ||
    pianos.length !== initialPianos.current.length ||
    pianos.some((p, i) => JSON.stringify(p) !== JSON.stringify(initialPianos.current[i]));

  function formatPhoneNumber(value: string) {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  }

  function isValidPhoneNumber(value: string) {
    // Must be exactly 10 digits
    return /^\(\d{3}\) \d{3}-\d{4}$/.test(value);
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    console.log('Input change:', field, value);
    if (field === 'phone' && typeof value === 'string') {
      value = formatPhoneNumber(value);
    }
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!form.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!form.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!form.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!isValidPhoneNumber(form.phone)) newErrors.phone = 'Phone number must be in format (XXX) XXX-XXXX';
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
    
    try {
      if (editingCustomerId) {
        // 1. Find removed pianos (in initialPianos but not in pianos)
        const removedPianos = initialPianos.current.filter(
          (initPiano) => !pianos.some((p) => p.id === initPiano.id)
        );
        // 2. Find new pianos (in pianos but not in initialPianos, i.e., no id)
        const newPianos = pianos.filter((p) => !p.id);
        // 3. Find updated pianos (same id, but fields changed)
        const updatedPianos = pianos.filter((p) => {
          if (!p.id) return false;
          const orig = initialPianos.current.find((ip) => ip.id === p.id);
          return orig && JSON.stringify(p) !== JSON.stringify(orig);
        });

        // 4. Await all requests
        await Promise.all([
          ...removedPianos.map((p) => fetch(`/api/pianos?id=${p.id}`, { method: 'DELETE' })),
          ...newPianos.map((p) => fetch('/api/pianos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...p, customerId: editingCustomerId }),
          })),
          ...updatedPianos.map((p) => fetch(`/api/pianos?id=${p.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(p),
          })),
        ]);

        // Then update the customer as before
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
      
      // Add mode: Create customer first
      const customerResponse = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      
      if (!customerResponse.ok) {
        const data = await customerResponse.json();
        setErrors({ form: data.error || 'Failed to add customer' });
        return;
      }
      
      const newCustomer = await customerResponse.json();
      
      // Create pianos for this customer if any exist
      if (pianos.length > 0) {
        try {
          const pianoPromises = pianos.map(async (piano) => {
            const pianoData = { ...piano, customerId: newCustomer.id };
            
            const response = await fetch('/api/pianos', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(pianoData),
            });
            
            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(`Failed to create piano: ${errorData.error || 'Unknown error'}`);
            }
            
            return response.json();
          });
          
          await Promise.all(pianoPromises);
        } catch (pianoError) {
          console.error('Failed to create pianos:', pianoError);
          // Don't fail the entire operation if piano creation fails
          // The customer was created successfully
        }
      }
      
      // Reset form
      setForm({
        firstName: '', lastName: '', companyName: '', email: '', phone: '', address: '', city: '', state: '', zipCode: '', textUpdates: false, emailUpdates: false,
      });
      setPianos([]);
      setErrors({});
      onSave(newCustomer);
    } catch (error) {
      console.error('Error saving customer:', error);
      setErrors({ form: 'An unexpected error occurred. Please try again.' });
    }
  };

  const handleClose = () => {
    console.log('AddCustomerModal handleClose called');
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

  const handleAddPiano = (piano: Partial<Piano>) => {
    setPianos((prev: Piano[]) => [...prev, { ...piano } as Piano]);
    setIsAddPianoModalOpen(false);
  };

  const handleRemovePiano = (idx: number) => {
    setPianos(prev => prev.filter((_, i) => i !== idx));
  };

  const handleEditPiano = (idx: number) => {
    setEditPianoIndex(idx);
    setIsEditPianoModalOpen(true);
  };

  const handleSaveEditPiano = (updatedPiano: Piano) => {
    setPianos((prev: Piano[]) => prev.map((p, i) => i === editPianoIndex ? updatedPiano : p));
    setIsEditPianoModalOpen(false);
    setEditPianoIndex(null);
  };

  const handleCloseEditPiano = () => {
    setIsEditPianoModalOpen(false);
    setEditPianoIndex(null);
  };

  const handleDeletePiano = (deletedPiano: Piano) => {
    setPianos(prev => prev.filter((p) => p.id !== deletedPiano.id));
    setIsEditPianoModalOpen(false);
    setEditPianoIndex(null);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={editingCustomerId ? 'Edit Customer' : 'Add New Customer'} widthClass="max-w-2xl">
      <div className="flex flex-col h-full">
        {/* Fixed Form Section */}
        <div className="space-y-4 flex-shrink-0">
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
              <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.phone} maxLength={14} onChange={e => handleInputChange('phone', e.target.value)} />
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
        </div>

        {/* Scrollable Pianos Section */}
        <div className="flex-1 min-h-0 mt-4">
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
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            {pianos.length === 0 ? (
              <div className="p-4 text-center">
                <p className="text-gray-500">No pianos added yet</p>
              </div>
            ) : (
              <div className="max-h-64 overflow-y-auto">
                <ul className="divide-y divide-gray-200">
                  {pianos.map((piano, idx) => (
                    <li
                      key={idx}
                      className="py-3 px-4 flex items-center justify-between group hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {piano.photoUrl ? (
                          <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center flex-shrink-0">
                            <img src={piano.photoUrl} alt="Piano" className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 group-hover:bg-gray-300 flex-shrink-0">
                            <span className="text-2xl">🎹</span>
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-gray-900 truncate">{piano.type} {piano.brand && `- ${piano.brand}`}{piano.model && ` ${piano.model}`}{piano.year && ` (${piano.year})`}</div>
                          <div className="text-xs text-gray-500">Serial: {piano.serialNumber || 'N/A'}</div>
                          <div className="text-xs text-gray-500">Last Service: {piano.lastServiceDate ? new Date(piano.lastServiceDate).toLocaleDateString() : 'Never'}</div>
                          {piano.notes && <div className="text-xs text-gray-400 mt-1 truncate">{piano.notes}</div>}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleEditPiano(idx)}
                        className="px-3 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 text-sm font-medium focus:outline-none min-w-[44px] min-h-[44px] ml-3 flex-shrink-0"
                      >
                        Edit
                      </button>
                    </li>
                  ))}
                </ul>
                {/* Add bottom padding for sticky bar on mobile INSIDE scrollable area */}
                <div className="h-20 md:hidden" />
              </div>
            )}
          </div>
        </div>
      </div>
      <AddPianoModal
        isOpen={isAddPianoModalOpen}
        onClose={() => setIsAddPianoModalOpen(false)}
        onSave={handleAddPiano}
      />
      {isEditPianoModalOpen && editPianoIndex !== null && pianos[editPianoIndex] && (
        <EditPianoModal
          isOpen={isEditPianoModalOpen}
          onClose={handleCloseEditPiano}
          onSave={handleSaveEditPiano}
          onDelete={handleDeletePiano}
          initialValues={pianos[editPianoIndex]!}
        />
      )}
      {/* Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-white border-t border-gray-200 px-4 py-3 flex justify-end space-x-2 md:static md:border-0 md:bg-transparent md:px-0 md:py-0">
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