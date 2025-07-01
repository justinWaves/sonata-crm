import React, { useState, useRef, useEffect } from 'react';
import Modal from './Modal';
import { AddCustomerModal } from './AddCustomerModal';
import { useCustomerTable } from './CustomerTableContext';
import { toast } from 'react-hot-toast';
import { FiCopy } from 'react-icons/fi';
import { IoCopyOutline, IoMailOutline, IoEllipsisHorizontal, IoPencilOutline, IoCallOutline, IoLocationOutline } from 'react-icons/io5';
import { Popover, Menu } from '@headlessui/react';
import CustomerCardModal from './CustomerCardModal';
import type { Customer } from '../types/customer';
import { useCustomerContext } from '../providers/CustomerContext';

interface CustomerTableProps {
  customers: Customer[];
  loading: boolean;
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

export const CustomerTable: React.FC<Omit<CustomerTableProps, 'selectedCustomer' | 'setSelectedCustomer'>> = (props) => {
  const {
    customers,
    loading,
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
  const { selectedCustomer, setSelectedCustomer, fetchCustomers, setCustomers, openCustomerModal, closeCustomerModal } = useCustomerContext();
  const [sort, setSort] = useState<{ column: string; direction: 'asc' | 'desc' }>({ column: 'firstName', direction: 'asc' });
  const headerCheckboxRef = useRef<HTMLInputElement>(null);
  const [openMenuKey, setOpenMenuKey] = useState<string | null>(null);

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
              filtered.map((customer) => {
                return (
                  <tr 
                    key={customer.id}
                    className="border-b border-gray-100"
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
                    <td
                      className="group relative py-4 px-6 text-sm text-gray-900 cursor-pointer"
                      tabIndex={0}
                      role="button"
                      aria-label={`View details for ${customer.firstName} ${customer.lastName}`}
                      onClick={() => openCustomerModal(customer)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          openCustomerModal(customer);
                        }
                      }}
                    >
                      {/* Hover/focus background */}
                      <div className="absolute inset-0 z-0 md:rounded-lg md:transition group-hover:bg-gray-100 group-focus-within:bg-gray-100"></div>
                      <div className="flex items-center relative z-10 w-full h-full">
                        <div className="w-10 h-10 min-w-[2.5rem] min-h-[2.5rem] rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                          {customer.firstName[0]}{customer.lastName[0]}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {highlightMatch ? (
                              <>{highlightMatch(customer.firstName + ' ' + customer.lastName, searchTerm)}</>
                            ) : (
                              <>{customer.firstName} {customer.lastName}</>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="group relative py-4 px-6 text-sm text-gray-900 w-48 max-w-xs cursor-pointer"
                        tabIndex={0}
                        role="button"
                        aria-label={`More actions for ${customer.phone}`}
                        onClick={e => { if (window.innerWidth >= 768) setOpenMenuKey(`${customer.id}-phone`); }}
                        onKeyDown={e => {
                          if ((e.key === 'Enter' || e.key === ' ') && window.innerWidth >= 768) {
                            e.preventDefault();
                            setOpenMenuKey(`${customer.id}-phone`);
                          }
                        }}
                    >
                      <ValueCellWithMenu
                        value={customer.phone}
                        label="Phone"
                        actions={[{
                          icon: <IoCopyOutline className='w-4 h-4' />, label: 'Copy Phone', onClick: () => { navigator.clipboard.writeText(customer.phone); toast.success('Phone copied!'); } },
                          { icon: <IoCallOutline className='w-4 h-4' />, label: 'Call', onClick: () => { window.open(`tel:${customer.phone}`); } },
                          { icon: <IoPencilOutline className='w-4 h-4' />, label: 'Edit', onClick: () => openEditModal(customer) },
                        ]}
                        menuKey={`${customer.id}-phone`}
                        openMenuKey={openMenuKey}
                        setOpenMenuKey={setOpenMenuKey}
                        isCell
                        searchTerm={searchTerm}
                        highlightMatch={highlightMatch}
                      />
                    </td>
                    <td className="group relative py-4 px-6 text-sm text-gray-900 w-48 max-w-xs cursor-pointer"
                        tabIndex={0}
                        role="button"
                        aria-label={`More actions for ${customer.email}`}
                        onClick={e => { if (window.innerWidth >= 768) setOpenMenuKey(`${customer.id}-email`); }}
                        onKeyDown={e => {
                          if ((e.key === 'Enter' || e.key === ' ') && window.innerWidth >= 768) {
                            e.preventDefault();
                            setOpenMenuKey(`${customer.id}-email`);
                          }
                        }}
                    >
                      <ValueCellWithMenu
                        value={customer.email}
                        label="Email"
                        actions={[{
                          icon: <IoCopyOutline className='w-4 h-4' />, label: 'Copy Email', onClick: () => { navigator.clipboard.writeText(customer.email || ''); toast.success('Email copied!'); } },
                          { icon: <IoMailOutline className='w-4 h-4' />, label: 'Send Email', onClick: () => { window.open(`mailto:${customer.email}`); } },
                          { icon: <IoPencilOutline className='w-4 h-4' />, label: 'Edit', onClick: () => openEditModal(customer) },
                        ]}
                        menuKey={`${customer.id}-email`}
                        openMenuKey={openMenuKey}
                        setOpenMenuKey={setOpenMenuKey}
                        isCell
                        searchTerm={searchTerm}
                        highlightMatch={highlightMatch}
                      />
                    </td>
                    <td className="group relative py-4 px-6 text-sm text-gray-900 w-64 max-w-xs cursor-pointer"
                        tabIndex={0}
                        role="button"
                        aria-label={`More actions for ${customer.address}`}
                        onClick={e => { if (window.innerWidth >= 768) setOpenMenuKey(`${customer.id}-address`); }}
                        onKeyDown={e => {
                          if ((e.key === 'Enter' || e.key === ' ') && window.innerWidth >= 768) {
                            e.preventDefault();
                            setOpenMenuKey(`${customer.id}-address`);
                          }
                        }}
                    >
                      <ValueCellWithMenu
                        value={[customer.address, customer.city, customer.state, customer.zipCode].filter(Boolean).join(', ') || '-'}
                        label="Address"
                        actions={[
                          { icon: <IoCopyOutline className='w-4 h-4' />, label: 'Copy Address', onClick: () => { const address = [customer.address, customer.city, customer.state, customer.zipCode].filter(Boolean).join(', '); navigator.clipboard.writeText(address); toast.success('Address copied!'); } },
                          { icon: <IoLocationOutline className='w-4 h-4' />, label: 'View on Map', onClick: () => { const address = [customer.address, customer.city, customer.state, customer.zipCode].filter(Boolean).join(', '); window.open(`https://www.google.com/maps/search/${encodeURIComponent(address)}`); } },
                          { icon: <IoPencilOutline className='w-4 h-4' />, label: 'Edit', onClick: () => openEditModal(customer) },
                        ]}
                        menuKey={`${customer.id}-address`}
                        openMenuKey={openMenuKey}
                        setOpenMenuKey={setOpenMenuKey}
                        isCell
                        searchTerm={searchTerm}
                        highlightMatch={highlightMatch}
                      />
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
                );
              })
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
      {selectedCustomer && (
        <CustomerCardModal
          customer={selectedCustomer}
          onClose={closeCustomerModal}
          onEdit={openEditModal}
        />
      )}
    </div>
  );
};

function ValueCellWithMenu({ value, label, actions, menuKey, openMenuKey, setOpenMenuKey, isCell, searchTerm, highlightMatch }: {
  value: string | null | undefined,
  label: string,
  actions: { icon: React.ReactNode, label: string, onClick: () => void }[],
  menuKey: string,
  openMenuKey: string | null,
  setOpenMenuKey: (key: string | null) => void,
  isCell?: boolean,
  searchTerm?: string,
  highlightMatch?: (text: string | null | undefined, search: string) => React.ReactNode
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const isOpen = openMenuKey === menuKey;
  useEffect(() => {
    if (!isOpen) return;
    function handle(e: MouseEvent) {
      if (e.target instanceof Node && !e.target.contains(e.target)) {
        setOpenMenuKey(null);
      }
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpenMenuKey(null);
    }
    document.addEventListener('mousedown', handle);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handle);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, setOpenMenuKey]);
  return (
    <div
      className={isCell ? 'absolute inset-0' : 'relative w-full h-full'}
    >
      {/* Hover/focus background */}
      <div className={
        'absolute inset-0 z-0 md:rounded-lg md:transition group-hover:bg-gray-100 group-focus-within:bg-gray-100' +
        (isOpen ? ' bg-gray-100' : '')
      }></div>
      <div className="relative z-10 flex items-center h-full w-full px-4 justify-center">
        <span className="truncate block max-w-full">
          {highlightMatch && searchTerm ? (
            <>{highlightMatch(value, searchTerm)}</>
          ) : (
            <>{value || '-'}</>
          )}
        </span>
      </div>
      {/* Tooltip and Menu as before */}
      {showTooltip && !isOpen && (
        <div className="absolute left-1/2 -translate-x-1/2 -top-8 z-40 bg-gray-900 text-white text-xs px-3 py-1 rounded shadow-lg whitespace-nowrap pointer-events-none">
          More actions
        </div>
      )}
      {isOpen && (
        <Menu as="div" className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-40 w-44 origin-top bg-white border border-gray-200 rounded-xl shadow-xl focus:outline-none py-2">
          {actions.map((action, i) => (
            <Menu.Item key={i}>
              {({ active }) => (
                <button
                  className={`flex items-center gap-2 px-4 py-2 text-sm w-full text-left ${active ? 'bg-gray-100' : ''}`}
                  onClick={() => { setOpenMenuKey(null); action.onClick(); }}
                  aria-label={action.label}
                >
                  {action.icon} {action.label}
                </button>
              )}
            </Menu.Item>
          ))}
          <Menu.Item>
            {({ active }) => (
              <button
                className={`flex items-center gap-2 px-4 py-2 text-sm w-full text-left text-red-600 ${active ? 'bg-gray-100' : ''}`}
                onMouseDown={e => { e.preventDefault(); setOpenMenuKey(null); if (document.activeElement instanceof HTMLElement) document.activeElement.blur(); }}
                aria-label="Close menu"
              >
                Close
              </button>
            )}
          </Menu.Item>
        </Menu>
      )}
    </div>
  );
}