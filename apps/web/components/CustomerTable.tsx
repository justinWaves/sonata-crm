import React, { useState, useRef, useEffect } from 'react';
import Modal from './Modal';
import { AddCustomerModal } from './AddCustomerModal';
import { useCustomerTable } from './CustomerTableContext';
import { toast } from 'react-hot-toast';
import { FiCopy } from 'react-icons/fi';
import { IoCopyOutline, IoMailOutline, IoEllipsisHorizontal, IoPencilOutline, IoCallOutline, IoLocationOutline } from 'react-icons/io5';
import { Popover, Menu } from '@headlessui/react';

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

interface CustomerTableProps {
  customers: Customer[];
  loading: boolean;
  selectedCustomer: Customer | null;
  setSelectedCustomer: (c: Customer | null) => void;
  isModalOpen: boolean;
  setIsModalOpen: (b: boolean) => void;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (b: boolean) => void;
  isEditModalOpen: boolean;
  setIsEditModalOpen: (b: boolean) => void;
  isAddPianoModalOpen: boolean;
  setIsAddPianoModalOpen: (b: boolean) => void;
  isEditPianoModalOpen: boolean;
  setIsEditPianoModalOpen: (b: boolean) => void;
  addForm: any;
  setAddForm: (f: any) => void;
  editForm: any;
  setEditForm: (f: any) => void;
  showDeleteConfirm: boolean;
  setShowDeleteConfirm: (b: boolean) => void;
  deleting: boolean;
  handleAddCustomer: () => Promise<void>;
  handleEditCustomer: () => Promise<void>;
  handleDeleteCustomer: () => Promise<void>;
  openPianoModal: (c: Customer) => void;
  closeModal: () => void;
  openEditModal: (c: Customer) => void;
  searchTerm?: string;
  highlightMatch?: (text: string | null | undefined, search: string) => React.ReactNode;
}

const ChevronUp = () => (
  <svg className="inline w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 15l-6-6-6 6" /></svg>
);

const ChevronDown = () => (
  <svg className="inline w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" /></svg>
);

const ClipboardIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="9" y="2" width="6" height="4" rx="1"/><rect x="5" y="6" width="14" height="16" rx="2"/></svg>
);

export const CustomerTable: React.FC<CustomerTableProps> = (props) => {
  const {
    customers,
    loading,
    selectedCustomer,
    setSelectedCustomer,
    isModalOpen,
    setIsModalOpen,
    isAddModalOpen,
    setIsAddModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isAddPianoModalOpen,
    setIsAddPianoModalOpen,
    isEditPianoModalOpen,
    setIsEditPianoModalOpen,
    addForm,
    setAddForm,
    editForm,
    setEditForm,
    showDeleteConfirm,
    setShowDeleteConfirm,
    deleting,
    handleAddCustomer,
    handleEditCustomer,
    handleDeleteCustomer,
    openPianoModal,
    closeModal,
    openEditModal,
    searchTerm = '',
    highlightMatch,
  } = props;
  const { query, selectedIds, setSelectedIds, toggleSelect } = useCustomerTable();
  const [sort, setSort] = useState<{ column: string; direction: 'asc' | 'desc' }>({ column: 'firstName', direction: 'asc' });
  const headerCheckboxRef = useRef<HTMLInputElement>(null);

  const filter = (c: Customer) => {
    const q = searchTerm.toLowerCase();
    return (
      c.firstName.toLowerCase().includes(q) ||
      c.lastName.toLowerCase().includes(q) ||
      (c.email || '').toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      (c.address || '').toLowerCase().includes(q) ||
      (c.city || '').toLowerCase().includes(q) ||
      (c.state || '').toLowerCase().includes(q) ||
      (c.zipCode || '').toLowerCase().includes(q)
    );
  };
  let filtered = customers.filter(filter);

  // Sorting logic
  const getSortValue = (c: Customer) => {
    switch (sort.column) {
      case 'firstName':
        return (c.firstName + ' ' + c.lastName).toLowerCase();
      case 'email':
        return (c.email || '').toLowerCase();
      case 'phone':
        return c.phone;
      case 'city':
        return (c.city || '').toLowerCase();
      default:
        return '';
    }
  };
  filtered = [...filtered].sort((a, b) => {
    const aVal = getSortValue(a);
    const bVal = getSortValue(b);
    if (aVal < bVal) return sort.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sort.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (column: string) => {
    setSort((prev) =>
      prev.column === column
        ? { column, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { column, direction: 'asc' }
    );
  };

  useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate =
        filtered.length > 0 &&
        filtered.some(c => selectedIds.has(c.id)) &&
        !filtered.every(c => selectedIds.has(c.id));
    }
  }, [filtered, selectedIds]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full">
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-max">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Name</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Phone</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Email</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Address</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Pianos</th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div className="ml-4">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="h-4 bg-gray-200 rounded w-28"></div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="h-4 bg-gray-200 rounded w-32 text-nowrap"></div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
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
    <div className="bg-white rounded-2xl shadow-xl p-8 w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Customers</h2>
        <p className="text-base text-gray-500">View and manage your customers</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-max">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-4 px-2 text-center">
                <input
                  ref={headerCheckboxRef}
                  type="checkbox"
                  checked={filtered.length > 0 && filtered.every(c => selectedIds.has(c.id))}
                  onChange={e => {
                    if (e.target.checked) {
                      setSelectedIds(new Set(filtered.map(c => c.id)));
                    } else {
                      setSelectedIds(new Set());
                    }
                  }}
                />
              </th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 cursor-pointer select-none" onClick={() => handleSort('firstName')}>
                Name
                {sort.column === 'firstName' && (
                  sort.direction === 'asc' ? <ChevronUp /> : <ChevronDown />
                )}
              </th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 cursor-pointer select-none" onClick={() => handleSort('phone')}>
                Phone
                {sort.column === 'phone' && (
                  sort.direction === 'asc' ? <ChevronUp /> : <ChevronDown />
                )}
              </th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 cursor-pointer select-none" onClick={() => handleSort('email')}>
                Email
                {sort.column === 'email' && (
                  sort.direction === 'asc' ? <ChevronUp /> : <ChevronDown />
                )}
              </th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 cursor-pointer select-none" onClick={() => handleSort('city')}>
                Address
                {sort.column === 'city' && (
                  sort.direction === 'asc' ? <ChevronUp /> : <ChevronDown />
                )}
              </th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Pianos</th>
              <th className="text-right py-4 px-6 text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">
                  No customers found
                </td>
              </tr>
            ) : (
              filtered.map((customer) => (
                <tr 
                  key={customer.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => openPianoModal(customer)}
                  tabIndex={0}
                  role="button"
                  aria-label={`Open details for ${customer.firstName} ${customer.lastName}`}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      openPianoModal(customer);
                    }
                  }}
                >
                  <td className="py-4 px-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(customer.id)}
                      onChange={e => {
                        e.stopPropagation();
                        toggleSelect(customer.id);
                      }}
                    />
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <div className="w-10 h-10 min-w-[2.5rem] min-h-[2.5rem] rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                        {customer.firstName[0]}{customer.lastName[0]}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {highlightMatch ? (
                            <>
                              {highlightMatch(customer.firstName, searchTerm)}
                              {highlightMatch(customer.lastName, searchTerm)}
                            </>
                          ) : (
                            <>
                              {customer.firstName}
                              {customer.lastName}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-900 relative w-48 max-w-xs">
                    <div className="flex items-center gap-2">
                      <span className="truncate w-32 block">
                        {highlightMatch ? highlightMatch(customer.phone, searchTerm) : customer.phone}
                      </span>
                      {customer.phone && (
                        <Menu as="div" className="relative w-8 flex-shrink-0 flex justify-center items-center">
                          <Menu.Button className="p-1 rounded bg-gray-100 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none transition" aria-label="More phone actions">
                            <IoEllipsisHorizontal className="w-5 h-5 text-gray-500" />
                          </Menu.Button>
                          <Menu.Items className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-30 w-40 origin-top bg-white border border-gray-200 divide-y divide-gray-100 rounded-lg shadow-lg focus:outline-none">
                            <div className="py-1">
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    className={`flex items-center w-full px-4 py-2 text-sm gap-2 ${active ? 'bg-gray-100' : ''}`}
                                    onClick={() => {
                                      navigator.clipboard.writeText(customer.phone!);
                                      toast.success('Phone copied!');
                                    }}
                                    aria-label="Copy phone"
                                  >
                                    <IoCopyOutline className="w-4 h-4" /> Copy Phone
                                  </button>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <a
                                    href={`tel:${customer.phone}`}
                                    className={`flex items-center w-full px-4 py-2 text-sm gap-2 ${active ? 'bg-gray-100' : ''}`}
                                    aria-label="Call phone"
                                  >
                                    <IoCallOutline className="w-4 h-4" /> Call
                                  </a>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    className={`flex items-center w-full px-4 py-2 text-sm gap-2 ${active ? 'bg-gray-100' : ''}`}
                                    onClick={e => {
                                      e.stopPropagation();
                                      openEditModal(customer);
                                    }}
                                    aria-label="Edit customer"
                                  >
                                    <IoPencilOutline className="w-4 h-4" /> Edit
                                  </button>
                                )}
                              </Menu.Item>
                            </div>
                          </Menu.Items>
                        </Menu>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-900 relative w-64 max-w-xs">
                    <div className="flex items-center gap-2">
                      <span className="truncate w-40 block">
                        {highlightMatch ? highlightMatch(customer.email || '-', searchTerm) : customer.email || '-'}
                      </span>
                      {customer.email && (
                        <Menu as="div" className="relative w-8 flex-shrink-0 flex justify-center items-center">
                          <Menu.Button className="p-1 rounded bg-gray-100 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none transition" aria-label="More email actions">
                            <IoEllipsisHorizontal className="w-5 h-5 text-gray-500" />
                          </Menu.Button>
                          <Menu.Items className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-30 w-40 origin-top bg-white border border-gray-200 divide-y divide-gray-100 rounded-lg shadow-lg focus:outline-none">
                            <div className="py-1">
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    className={`flex items-center w-full px-4 py-2 text-sm gap-2 ${active ? 'bg-gray-100' : ''}`}
                                    onClick={() => {
                                      navigator.clipboard.writeText(customer.email!);
                                      toast.success('Email copied!');
                                    }}
                                    aria-label="Copy email"
                                  >
                                    <IoCopyOutline className="w-4 h-4" /> Copy Email
                                  </button>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <a
                                    href={`mailto:${customer.email}`}
                                    className={`flex items-center w-full px-4 py-2 text-sm gap-2 ${active ? 'bg-gray-100' : ''}`}
                                    aria-label="Send email"
                                  >
                                    <IoMailOutline className="w-4 h-4" /> Send Email
                                  </a>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    className={`flex items-center w-full px-4 py-2 text-sm gap-2 ${active ? 'bg-gray-100' : ''}`}
                                    onClick={e => {
                                      e.stopPropagation();
                                      openEditModal(customer);
                                    }}
                                    aria-label="Edit customer"
                                  >
                                    <IoPencilOutline className="w-4 h-4" /> Edit
                                  </button>
                                )}
                              </Menu.Item>
                            </div>
                          </Menu.Items>
                        </Menu>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-900 relative w-64 max-w-xs">
                    <div className="flex items-center gap-2">
                      <span className="truncate w-40 block">
                        {(() => {
                          const address = [customer.address, customer.city, customer.state, customer.zipCode].filter(Boolean).join(', ');
                          if (!address) return '-';
                          return highlightMatch ? highlightMatch(address, searchTerm) : address;
                        })()}
                      </span>
                      {(() => {
                        const address = [customer.address, customer.city, customer.state, customer.zipCode].filter(Boolean).join(', ');
                        if (!address) return null;
                        return (
                          <Menu as="div" className="relative w-8 flex-shrink-0 flex justify-center items-center">
                            <Menu.Button className="p-1 rounded bg-gray-100 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none transition" aria-label="More address actions">
                              <IoEllipsisHorizontal className="w-5 h-5 text-gray-500" />
                            </Menu.Button>
                            <Menu.Items className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-30 w-48 origin-top bg-white border border-gray-200 divide-y divide-gray-100 rounded-lg shadow-lg focus:outline-none">
                              <div className="py-1">
                                <Menu.Item>
                                  {({ active }) => (
                                    <button
                                      type="button"
                                      className="p-1 border border-gray-300 rounded-md bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition group"
                                      aria-label="Copy address"
                                      onClick={e => {
                                        e.stopPropagation();
                                        navigator.clipboard.writeText(address);
                                        toast.success('Address copied!');
                                      }}
                                      onKeyDown={e => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          navigator.clipboard.writeText(address);
                                          toast.success('Address copied!');
                                        }
                                      }}
                                    >
                                      <IoCopyOutline className="w-4 h-4" />
                                    </button>
                                  )}
                                </Menu.Item>
                                <Menu.Item>
                                  {({ active }) => (
                                    <a
                                      href={`https://www.google.com/maps/search/${encodeURIComponent(address)}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className={`flex items-center w-full px-4 py-2 text-sm gap-2 ${active ? 'bg-gray-100' : ''}`}
                                      aria-label="View on map"
                                    >
                                      <IoLocationOutline className="w-4 h-4" /> View on Map
                                    </a>
                                  )}
                                </Menu.Item>
                                <Menu.Item>
                                  {({ active }) => (
                                    <button
                                      className={`flex items-center w-full px-4 py-2 text-sm gap-2 ${active ? 'bg-gray-100' : ''}`}
                                      onClick={e => {
                                        e.stopPropagation();
                                        openEditModal(customer);
                                      }}
                                      aria-label="Edit customer"
                                    >
                                      <IoPencilOutline className="w-4 h-4" /> Edit
                                    </button>
                                  )}
                                </Menu.Item>
                              </div>
                            </Menu.Items>
                          </Menu>
                        );
                      })()}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-900">
                      {(customer.pianos || []).length} Piano{(customer.pianos || []).length !== 1 ? 's' : ''}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(customer);
                        }}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCustomer(customer);
                          setShowDeleteConfirm(true);
                        }}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                        aria-label="Delete customer"
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
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete Customer?"
      >
        <p className="text-gray-700 mb-6">This will permanently delete the selected customer and all related data. Are you sure?</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setShowDeleteConfirm(false)}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
            disabled={deleting}
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteCustomer}
            className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium shadow-sm hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={deleting}
            aria-label="Delete customer"
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </Modal>
    </div>
  );
};

function EmailPopoverCell({ email, highlightMatch, searchTerm }: { email: string | null; highlightMatch?: (text: string | null | undefined, search: string) => React.ReactNode; searchTerm: string; }) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const closeTimeout = useRef<NodeJS.Timeout | null>(null);
  const handleOpen = () => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setPopoverOpen(true);
  };
  const handleClose = () => {
    closeTimeout.current = setTimeout(() => setPopoverOpen(false), 100);
  };
  return (
    <div
      className="flex items-center gap-2 group"
      onMouseEnter={handleOpen}
      onMouseLeave={handleClose}
      onFocus={handleOpen}
      onBlur={handleClose}
      tabIndex={0}
      style={{ outline: 'none' }}
    >
      <span
        className="cursor-pointer group-hover:underline group-focus:underline transition"
        tabIndex={-1}
      >
        {highlightMatch ? highlightMatch(email || '-', searchTerm) : email || '-'}
      </span>
      {email && popoverOpen && (
        <div
          className="absolute z-20 bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 flex gap-2 animate-fade-in"
          onMouseEnter={handleOpen}
          onMouseLeave={handleClose}
        >
          <button
            type="button"
            className="p-2 rounded hover:bg-gray-100 focus:bg-gray-100"
            onClick={() => {
              navigator.clipboard.writeText(email);
              toast.success('Email copied!');
            }}
            aria-label="Copy email"
          >
            <IoCopyOutline className="w-5 h-5" />
          </button>
          <a
            href={`mailto:${email}`}
            className="p-2 rounded hover:bg-gray-100 focus:bg-gray-100"
            aria-label="Send email"
          >
            <IoMailOutline className="w-5 h-5" />
          </a>
        </div>
      )}
    </div>
  );
}