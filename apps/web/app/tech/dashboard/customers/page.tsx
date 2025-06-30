"use client";
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useReferralCode } from '../../../hooks/useReferralCode';
import { createPortal } from 'react-dom';
import Modal from '../../../../components/Modal';
import { AddCustomerModal } from '../../../../components/AddCustomerModal';
import { CustomerTableProvider } from '../../../../components/CustomerTableContext';
import SearchBar from '../../../../components/SearchBar';
import { CustomerTable } from '../../../../components/CustomerTable';
import BulkBar from '../../../../components/BulkBar';
import CustomerCardList from '../../../../components/CustomerCardList';
import Pagination from '../../../../components/Pagination';
import { highlightMatch } from '../../../../lib/utils';

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
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;
  const [searchTerm, setSearchTerm] = useState('');

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
    if (!selectedCustomer?.id) return;
    setDeleting(true);
    try {
      const response = await fetch(`/api/customers?id=${selectedCustomer.id}`, {
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

  const filteredCustomers = customers.filter((customer) => {
    const term = searchTerm.toLowerCase();
    return (
      customer.firstName.toLowerCase().includes(term) ||
      customer.lastName.toLowerCase().includes(term) ||
      (customer.email?.toLowerCase() || '').includes(term) ||
      customer.phone.includes(term) ||
      customer.address.toLowerCase().includes(term) ||
      (customer.city?.toLowerCase() || '').includes(term) ||
      (customer.state?.toLowerCase() || '').includes(term) ||
      (customer.zipCode?.toLowerCase() || '').includes(term)
    );
  });
  const totalPages = Math.ceil(filteredCustomers.length / pageSize);
  const paginatedCustomers = filteredCustomers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <CustomerTableProvider>
      <div
        className="fixed top-[56px] z-30 flex items-center justify-between px-8 py-4 bg-opacity-0 backdrop-blur-sm w-full left-0 md:left-[168px] md:w-[calc(100vw-168px)]"
        style={{ minWidth: 0 }}
      >
        <div className="max-w-md w-full">
          <SearchBar value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ml-4 text-nowrap"
            >
              Add Customer
            </button>
        </div>
      <div className='pt-[44px] w-fit md:pr-8 mx-auto'>
        <div className="hidden md:block">
          <CustomerTable
            customers={paginatedCustomers}
            loading={loading}
            selectedCustomer={selectedCustomer}
            setSelectedCustomer={setSelectedCustomer}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            isAddModalOpen={isAddModalOpen}
            setIsAddModalOpen={setIsAddModalOpen}
            isEditModalOpen={isEditModalOpen}
            setIsEditModalOpen={setIsEditModalOpen}
            isAddPianoModalOpen={isAddPianoModalOpen}
            setIsAddPianoModalOpen={setIsAddPianoModalOpen}
            isEditPianoModalOpen={isEditPianoModalOpen}
            setIsEditPianoModalOpen={setIsEditPianoModalOpen}
            addForm={addForm}
            setAddForm={setAddForm}
            editForm={editForm}
            setEditForm={setEditForm}
            showDeleteConfirm={showDeleteConfirm}
            setShowDeleteConfirm={setShowDeleteConfirm}
            deleting={deleting}
            handleAddCustomer={handleAddCustomer}
            handleEditCustomer={handleEditCustomer}
            handleDeleteCustomer={handleDeleteCustomer}
            openPianoModal={openPianoModal}
            closeModal={closeModal}
            openEditModal={openEditModal}
            searchTerm={searchTerm}
            highlightMatch={highlightMatch}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
              />
            </div>
        <div className="flex flex-col gap-2 md:hidden">
          <CustomerCardList
            customers={paginatedCustomers}
            openEditModal={openEditModal}
            setShowDeleteConfirm={setShowDeleteConfirm}
            setSelectedCustomer={setSelectedCustomer}
            searchTerm={searchTerm}
            highlightMatch={highlightMatch}
            isLoading={loading}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
              />
            </div>
        <BulkBar customers={customers} fetchCustomers={fetchCustomers} setCustomers={setCustomers} />
        <AddCustomerModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={(newCustomer: any) => {
            const safeCustomer = {
              id: newCustomer.id,
              firstName: newCustomer.firstName,
              lastName: newCustomer.lastName,
              companyName: newCustomer.companyName ?? null,
              email: newCustomer.email ?? null,
              phone: newCustomer.phone,
              address: newCustomer.address,
              city: newCustomer.city ?? null,
              state: newCustomer.state ?? null,
              zipCode: newCustomer.zipCode ?? null,
              textUpdates: newCustomer.textUpdates ?? false,
              emailUpdates: newCustomer.emailUpdates ?? false,
              referralCode: newCustomer.referralCode ?? null,
              createdAt: newCustomer.createdAt || new Date().toISOString(),
              updatedAt: newCustomer.updatedAt || new Date().toISOString(),
              pianos: Array.isArray(newCustomer.pianos) ? newCustomer.pianos : [],
            };
            setCustomers(prev => [safeCustomer, ...prev]);
            setIsAddModalOpen(false);
            toast.success('Customer added!');
          }}
        />
        {isEditModalOpen && (
          <AddCustomerModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onSave={(updatedCustomer) => {
              setIsEditModalOpen(false);
              setCustomers((prev) => prev.map((c) => c.id === updatedCustomer.id ? { ...c, ...updatedCustomer } : c));
              setSelectedCustomer((prev) => prev && prev.id === updatedCustomer.id ? { ...prev, ...updatedCustomer } : prev);
              toast.success('Customer updated!');
            }}
            initialValues={editForm}
            editingCustomerId={editForm.id}
          />
        )}
            </div>
    </CustomerTableProvider>
  );
} 