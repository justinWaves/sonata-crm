"use client";
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useReferralCode } from '../../../hooks/useReferralCode';

interface Piano {
  id: string;
  type: string;
  brand: string | null;
  year: number | null;
  model: string | null;
  serialNumber: string | null;
  lastServiceDate: string | null;
  notes: string | null;
}

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string;
  address: string;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  companyName?: string | null;
  referralCode?: string | null;
  textUpdates?: boolean;
  emailUpdates?: boolean;
  createdAt: string;
  updatedAt: string;
  pianos?: Piano[];
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddPianoModalOpen, setIsAddPianoModalOpen] = useState(false);
  const [isEditPianoModalOpen, setIsEditPianoModalOpen] = useState(false);
  const [addForm, setAddForm] = useState({
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
  const [editForm, setEditForm] = useState({
    id: '',
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
    referralCode: '',
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [originalEditData, setOriginalEditData] = useState<any>(null);
  const [addPianoForm, setAddPianoForm] = useState({
    type: '',
    brand: '',
    model: '',
    year: '',
    serialNumber: '',
    notes: '',
    lastServiceDate: '',
  });
  const [editPianoForm, setEditPianoForm] = useState({
    id: '',
    type: '',
    brand: '',
    model: '',
    year: '',
    serialNumber: '',
    notes: '',
    lastServiceDate: '',
  });
  const [showDeletePianoConfirm, setShowDeletePianoConfirm] = useState(false);
  const [originalEditPianoData, setOriginalEditPianoData] = useState<any>(null);
  const [deletingPiano, setDeletingPiano] = useState(false);

  const generateReferralCode = useReferralCode();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers');
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch customers');
      const customersList = data.map((customer: Customer) => ({
        ...customer,
        pianos: customer.pianos || []
      }));
      setCustomers(customersList);
      return customersList;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to fetch customers');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const openPianoModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCustomer(null);
  };

  const handleAddCustomer = async () => {
    const referralCode = generateReferralCode();
    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...addForm, referralCode }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to add customer');
      }
      setIsAddModalOpen(false);
      setAddForm({
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
      const updatedCustomers = await fetchCustomers();
      setSelectedCustomer((prev) => {
        if (!prev) return prev;
        const updated = updatedCustomers.find((c: Customer) => c.id === prev.id);
        return updated || prev;
      });
      toast.success('Customer added!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add customer');
    }
  };

  const openEditModal = (customer: Customer) => {
    const data = {
      id: customer.id,
      firstName: customer.firstName || '',
      lastName: customer.lastName || '',
      companyName: customer.companyName || '',
      email: customer.email || '',
      phone: customer.phone || '',
      address: customer.address || '',
      city: customer.city || '',
      state: customer.state || '',
      zipCode: customer.zipCode || '',
      textUpdates: !!customer.textUpdates,
      emailUpdates: !!customer.emailUpdates,
      referralCode: customer.referralCode || '',
    };
    setEditForm(data);
    setOriginalEditData(data);
    setIsEditModalOpen(true);
  };

  const isEditFormChanged = () => {
    if (!originalEditData) return false;
    const keys: (keyof typeof editForm)[] = [
      'firstName', 'lastName', 'companyName', 'email', 'phone', 'address', 'city', 'state', 'zipCode', 'textUpdates', 'emailUpdates'
    ];
    return keys.some((key) => editForm[key] !== originalEditData[key]);
  };

  const handleEditCustomer = async () => {
    try {
      const response = await fetch('/api/customers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      if (!response.ok) {
        const data = await response.json();
        setEditForm(originalEditData);
        throw new Error(data.error || 'Failed to update customer');
      }
      const updated = await response.json();
      setOriginalEditData(updated);
      setEditForm(updated);
      const updatedCustomers = await fetchCustomers();
      setSelectedCustomer((prev) => {
        if (!prev) return prev;
        const updated = updatedCustomers.find((c: Customer) => c.id === prev.id);
        return updated || prev;
      });
      toast.success('Customer updated!');
    } catch (error) {
      setEditForm(originalEditData);
      toast.error(error instanceof Error ? error.message : 'Failed to update customer. Changes reverted.');
    }
  };

  const handleDeleteCustomer = async () => {
    if (!editForm.id) return;
    setDeleting(true);
    try {
      const response = await fetch(`/api/customers?id=${editForm.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete customer');
      }
      setShowDeleteConfirm(false);
      setIsEditModalOpen(false);
      setSelectedCustomer(null);
      const updatedCustomers = await fetchCustomers();
      setCustomers(updatedCustomers);
      toast.success('Customer deleted!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete customer');
    } finally {
      setDeleting(false);
    }
  };

  const handleAddPiano = async () => {
    if (!selectedCustomer) return;
    try {
      const response = await fetch('/api/pianos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...addPianoForm,
          customerId: selectedCustomer.id,
        }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to add piano');
      }
      setIsAddPianoModalOpen(false);
      setAddPianoForm({ type: '', brand: '', model: '', year: '', serialNumber: '', notes: '', lastServiceDate: '' });
      const updatedCustomers = await fetchCustomers();
      setSelectedCustomer((prev) => {
        if (!prev) return prev;
        const updated = updatedCustomers.find((c: Customer) => c.id === prev.id);
        return updated || prev;
      });
      toast.success('Piano added!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add piano');
    }
  };

  const openEditPianoModal = (piano: Piano) => {
    const data = {
      id: piano.id,
      type: piano.type || '',
      brand: piano.brand || '',
      model: piano.model || '',
      year: piano.year ? String(piano.year) : '',
      serialNumber: piano.serialNumber || '',
      notes: piano.notes || '',
      lastServiceDate: piano.lastServiceDate?.split('T')[0] || '',
    };
    setEditPianoForm(data);
    setOriginalEditPianoData(data);
    setIsEditPianoModalOpen(true);
  };

  const isEditPianoFormChanged = () => {
    if (!originalEditPianoData) return false;
    const keys: (keyof typeof editPianoForm)[] = [
      'type', 'brand', 'model', 'year', 'serialNumber', 'notes', 'lastServiceDate'
    ];
    return keys.some((key) => editPianoForm[key] !== originalEditPianoData[key]);
  };

  const handleEditPiano = async () => {
    try {
      const response = await fetch('/api/pianos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editPianoForm),
      });
      if (!response.ok) {
        const data = await response.json();
        setEditPianoForm(originalEditPianoData);
        throw new Error(data.error || 'Failed to update piano');
      }
      setIsEditPianoModalOpen(false);
      const updatedCustomers = await fetchCustomers();
      setSelectedCustomer((prev) => {
        if (!prev) return prev;
        const updated = updatedCustomers.find((c: Customer) => c.id === prev.id);
        return updated || prev;
      });
      toast.success('Piano updated!');
    } catch (error) {
      setEditPianoForm(originalEditPianoData);
      toast.error(error instanceof Error ? error.message : 'Failed to update piano. Changes reverted.');
    }
  };

  const handleDeletePiano = async () => {
    setDeletingPiano(true);
    try {
      const response = await fetch(`/api/pianos?id=${editPianoForm.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete piano');
      }
      setShowDeletePianoConfirm(false);
      setIsEditPianoModalOpen(false);
      const updatedCustomers = await fetchCustomers();
      setSelectedCustomer((prev) => {
        if (!prev) return prev;
        const updated = updatedCustomers.find((c: Customer) => c.id === prev.id);
        return updated || prev;
      });
      toast.success('Piano deleted!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete piano');
    } finally {
      setDeletingPiano(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg text-gray-600">Loading customers...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Customers</h2>
            <p className="text-base text-gray-500">Manage your customers and their pianos</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Name</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Phone</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Email</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Address</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Pianos</th>
                </tr>
              </thead>
              <tbody>
                {customers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500">
                      No customers found
                    </td>
                  </tr>
                ) : (
                  customers.map((customer) => (
                    <tr 
                      key={customer.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => openPianoModal(customer)}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <div className="w-10 h-10 min-w-[2.5rem] min-h-[2.5rem] rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                            {customer.firstName[0]}{customer.lastName[0]}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {customer.firstName} {customer.lastName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-900">{customer.phone}</td>
                      <td className="py-4 px-6 text-sm text-gray-900">{customer.email || '-'}</td>
                      <td className="py-4 px-6 text-sm text-gray-900">
                        {[customer.address, customer.city, customer.state, customer.zipCode].filter(Boolean).join(', ')}
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm text-gray-900">
                          {(customer.pianos || []).length} Piano{(customer.pianos || []).length !== 1 ? 's' : ''}
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
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add Customer
            </button>
          </div>
        </div>
      </div>

      {/* Customer Modal */}
      {isModalOpen && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
            onClick={closeModal}
          />
          <div className="relative bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl z-10">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 min-w-[4rem] min-h-[4rem] rounded-full bg-blue-100 flex items-center justify-center text-2xl text-blue-600 font-bold">
                  {selectedCustomer.firstName[0]}{selectedCustomer.lastName[0]}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {selectedCustomer.firstName} {selectedCustomer.lastName}
                  </h3>
                  {selectedCustomer.companyName && (
                    <div className="text-sm text-gray-500 font-medium">{selectedCustomer.companyName}</div>
                  )}
                  <div className="text-sm text-gray-500 mt-1">
                    {selectedCustomer.email} • {selectedCustomer.phone}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {[
                      selectedCustomer.address,
                      selectedCustomer.city,
                      selectedCustomer.state,
                      selectedCustomer.zipCode
                    ].filter(Boolean).join(', ')}
                  </div>
                  {selectedCustomer.referralCode && (
                    <div className="text-xs text-gray-400 mt-1">Referral: {selectedCustomer.referralCode}</div>
                  )}
                  <div className="flex space-x-2 mt-1">
                    {selectedCustomer.textUpdates && (
                      <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">Text Updates</span>
                    )}
                    {selectedCustomer.emailUpdates && (
                      <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded">Email Updates</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditModal(selectedCustomer);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Edit Customer
                </button>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <hr className="my-4 border-gray-200" />

            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-lg font-semibold text-gray-900">Pianos</h4>
                <button
                  onClick={() => setIsAddPianoModalOpen(true)}
                  className="inline-flex items-center px-3 py-1 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add Piano
                </button>
              </div>
              {selectedCustomer.pianos?.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No pianos added yet</p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {selectedCustomer.pianos?.map((piano) => (
                    <li key={piano.id} className="py-4 flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{piano.type} {piano.brand && `- ${piano.brand}`}{piano.model && ` ${piano.model}`}{piano.year && ` (${piano.year})`}</div>
                        <div className="text-xs text-gray-500">Serial: {piano.serialNumber || 'N/A'}</div>
                        <div className="text-xs text-gray-500">Last Service: {piano.lastServiceDate ? new Date(piano.lastServiceDate).toLocaleDateString() : 'Never'}</div>
                        {piano.notes && <div className="text-xs text-gray-400 mt-1">{piano.notes}</div>}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditPianoModal(piano);
                        }}
                        className="text-gray-400 hover:text-blue-600 text-sm font-medium border border-gray-200 rounded px-3 py-1"
                      >
                        Edit
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg z-10">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Add Customer</h3>
            <form className="space-y-4">
              <div className="flex gap-2">
                <div className="w-1/2">
                  <label className="block text-sm font-medium mb-1 text-gray-700">First Name</label>
                  <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={addForm.firstName} onChange={e => setAddForm(f => ({ ...f, firstName: e.target.value }))} />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-medium mb-1 text-gray-700">Last Name</label>
                  <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={addForm.lastName} onChange={e => setAddForm(f => ({ ...f, lastName: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Company (optional)</label>
                <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={addForm.companyName} onChange={e => setAddForm(f => ({ ...f, companyName: e.target.value }))} />
              </div>
              <div className="flex gap-2">
                <div className="w-1/2">
                  <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
                  <input type="email" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={addForm.email} onChange={e => setAddForm(f => ({ ...f, email: e.target.value }))} />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-medium mb-1 text-gray-700">Phone</label>
                  <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={addForm.phone} onChange={e => setAddForm(f => ({ ...f, phone: e.target.value }))} />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-1/2">
                  <label className="block text-sm font-medium mb-1 text-gray-700">Address</label>
                  <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={addForm.address} onChange={e => setAddForm(f => ({ ...f, address: e.target.value }))} />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-medium mb-1 text-gray-700">City</label>
                  <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={addForm.city} onChange={e => setAddForm(f => ({ ...f, city: e.target.value }))} />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-1/2">
                  <label className="block text-sm font-medium mb-1 text-gray-700">State</label>
                  <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={addForm.state} onChange={e => setAddForm(f => ({ ...f, state: e.target.value }))} />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-medium mb-1 text-gray-700">Zip Code</label>
                  <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={addForm.zipCode} onChange={e => setAddForm(f => ({ ...f, zipCode: e.target.value }))} />
                </div>
              </div>
              <div className="flex space-x-4">
                <label className="flex items-center text-sm text-gray-700">
                  <input type="checkbox" className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked={addForm.textUpdates} onChange={e => setAddForm(f => ({ ...f, textUpdates: e.target.checked }))} />
                  Text Updates
                </label>
                <label className="flex items-center text-sm text-gray-700">
                  <input type="checkbox" className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked={addForm.emailUpdates} onChange={e => setAddForm(f => ({ ...f, emailUpdates: e.target.checked }))} />
                  Email Updates
                </label>
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 font-medium shadow-sm">Cancel</button>
                <button type="button" onClick={handleAddCustomer} className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium shadow-sm hover:bg-blue-700">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Customer Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg z-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Edit Customer</h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-500 ml-4"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form className="w-full space-y-4">
              <div className="flex gap-2">
                <div className="w-1/2">
                  <label className="block text-sm font-medium mb-1 text-gray-700">First Name</label>
                  <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={editForm.firstName} onChange={e => setEditForm(f => ({ ...f, firstName: e.target.value }))} />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-medium mb-1 text-gray-700">Last Name</label>
                  <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={editForm.lastName} onChange={e => setEditForm(f => ({ ...f, lastName: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Company (optional)</label>
                <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={editForm.companyName} onChange={e => setEditForm(f => ({ ...f, companyName: e.target.value }))} />
              </div>
              <div className="flex gap-2">
                <div className="w-1/2">
                  <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
                  <input type="email" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={editForm.email} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-medium mb-1 text-gray-700">Phone</label>
                  <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={editForm.phone} onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))} />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-1/2">
                  <label className="block text-sm font-medium mb-1 text-gray-700">Address</label>
                  <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={editForm.address} onChange={e => setEditForm(f => ({ ...f, address: e.target.value }))} />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-medium mb-1 text-gray-700">City</label>
                  <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={editForm.city} onChange={e => setEditForm(f => ({ ...f, city: e.target.value }))} />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-1/2">
                  <label className="block text-sm font-medium mb-1 text-gray-700">State</label>
                  <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={editForm.state} onChange={e => setEditForm(f => ({ ...f, state: e.target.value }))} />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-medium mb-1 text-gray-700">Zip Code</label>
                  <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={editForm.zipCode} onChange={e => setEditForm(f => ({ ...f, zipCode: e.target.value }))} />
                </div>
              </div>
              <div className="flex gap-4">
                <label className="flex items-center text-sm text-gray-700">
                  <input type="checkbox" className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked={editForm.textUpdates} onChange={e => setEditForm(f => ({ ...f, textUpdates: e.target.checked }))} />
                  Text Updates
                </label>
                <label className="flex items-center text-sm text-gray-700">
                  <input type="checkbox" className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked={editForm.emailUpdates} onChange={e => setEditForm(f => ({ ...f, emailUpdates: e.target.checked }))} />
                  Email Updates
                </label>
              </div>
              <div className="flex items-center pt-2">
                <button
                  type="button"
                  className="text-red-600 hover:underline font-medium mr-4"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  Delete Customer
                </button>
                <span className="flex-1"></span>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 font-medium shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="ml-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!isEditFormChanged()}
                  onClick={handleEditCustomer}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm z-10 flex flex-col items-center">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Are you sure?</h3>
            <p className="text-gray-600 mb-6 text-center">This will permanently delete the customer and all associated pianos and appointments.</p>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 font-medium shadow-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium shadow-sm hover:bg-red-700"
                onClick={handleDeleteCustomer}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Piano Modal */}
      {isAddPianoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsAddPianoModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg z-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Add Piano</h3>
              <button
                type="button"
                onClick={() => setIsAddPianoModalOpen(false)}
                className="text-gray-400 hover:text-gray-500 ml-4"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form className="w-full space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Type <span className="text-red-500">*</span></label>
                <select
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={addPianoForm.type}
                  onChange={e => setAddPianoForm(f => ({ ...f, type: e.target.value }))}
                >
                  <option value="">Select type</option>
                  <option value="Grand">Grand</option>
                  <option value="Upright">Upright</option>
                  <option value="Console">Console</option>
                  <option value="Spinet">Spinet</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="flex gap-2">
                <div className="w-1/2">
                  <label className="block text-sm font-medium mb-1 text-gray-700">Brand</label>
                  <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={addPianoForm.brand} onChange={e => setAddPianoForm(f => ({ ...f, brand: e.target.value }))} />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-medium mb-1 text-gray-700">Model</label>
                  <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={addPianoForm.model} onChange={e => setAddPianoForm(f => ({ ...f, model: e.target.value }))} />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-1/2">
                  <label className="block text-sm font-medium mb-1 text-gray-700">Year</label>
                  <input type="number" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={addPianoForm.year} onChange={e => setAddPianoForm(f => ({ ...f, year: e.target.value }))} />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-medium mb-1 text-gray-700">Serial Number</label>
                  <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={addPianoForm.serialNumber} onChange={e => setAddPianoForm(f => ({ ...f, serialNumber: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Notes</label>
                <textarea className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={addPianoForm.notes} onChange={e => setAddPianoForm(f => ({ ...f, notes: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Last Service</label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={addPianoForm.lastServiceDate}
                  onChange={e => setAddPianoForm(f => ({ ...f, lastServiceDate: e.target.value }))}
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setIsAddPianoModalOpen(false)} className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 font-medium shadow-sm">Cancel</button>
                <button type="button" onClick={handleAddPiano} className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium shadow-sm hover:bg-blue-700">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Piano Modal */}
      {isEditPianoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsEditPianoModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg z-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Edit Piano</h3>
              <button
                type="button"
                onClick={() => setIsEditPianoModalOpen(false)}
                className="text-gray-400 hover:text-gray-500 ml-4"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form className="w-full space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Type <span className="text-red-500">*</span></label>
                <select
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={editPianoForm.type}
                  onChange={e => setEditPianoForm(f => ({ ...f, type: e.target.value }))}
                >
                  <option value="">Select type</option>
                  <option value="Grand">Grand</option>
                  <option value="Upright">Upright</option>
                  <option value="Console">Console</option>
                  <option value="Spinet">Spinet</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="flex gap-2">
                <div className="w-1/2">
                  <label className="block text-sm font-medium mb-1 text-gray-700">Brand</label>
                  <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={editPianoForm.brand} onChange={e => setEditPianoForm(f => ({ ...f, brand: e.target.value }))} />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-medium mb-1 text-gray-700">Model</label>
                  <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={editPianoForm.model} onChange={e => setEditPianoForm(f => ({ ...f, model: e.target.value }))} />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-1/2">
                  <label className="block text-sm font-medium mb-1 text-gray-700">Year</label>
                  <input type="number" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={editPianoForm.year} onChange={e => setEditPianoForm(f => ({ ...f, year: e.target.value }))} />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-medium mb-1 text-gray-700">Serial Number</label>
                  <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={editPianoForm.serialNumber} onChange={e => setEditPianoForm(f => ({ ...f, serialNumber: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Last Service</label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={editPianoForm.lastServiceDate}
                  onChange={e => setEditPianoForm(f => ({ ...f, lastServiceDate: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Notes</label>
                <textarea className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={editPianoForm.notes} onChange={e => setEditPianoForm(f => ({ ...f, notes: e.target.value }))} />
              </div>
              <div className="flex items-center pt-2">
                <button
                  type="button"
                  className="text-red-600 hover:underline font-medium mr-4"
                  onClick={() => setShowDeletePianoConfirm(true)}
                >
                  Delete Piano
                </button>
                <span className="flex-1"></span>
                <button
                  type="button"
                  className="ml-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 font-medium shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="ml-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!isEditPianoFormChanged()}
                  onClick={handleEditPiano}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Piano Confirmation Modal */}
      {showDeletePianoConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowDeletePianoConfirm(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm z-10 flex flex-col items-center">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Are you sure?</h3>
            <p className="text-gray-600 mb-6 text-center">This will permanently delete this piano and all associated service records.</p>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setShowDeletePianoConfirm(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 font-medium shadow-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium shadow-sm hover:bg-red-700"
                onClick={handleDeletePiano}
                disabled={deletingPiano}
              >
                {deletingPiano ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 