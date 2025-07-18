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
import { useCustomerContext } from '../app/tech/dashboard/customers/CustomerProvider';

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
  sort?: { column: string; direction: 'asc' | 'desc' };
  onSort?: (column: string) => void;
  displayCount?: { startIndex: number; endIndex: number; totalCount: number };
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
    sort = { column: 'firstName', direction: 'asc' },
    onSort,
    displayCount,
  } = props;
  const { query, selectedIds, setSelectedIds, toggleSelect } = useCustomerTable();
  const { selectedCustomer, setSelectedCustomer, fetchCustomers, setCustomers, openCustomerModal, closeCustomerModal } = useCustomerContext();
  const headerCheckboxRef = useRef<HTMLInputElement>(null);
  const [openMenuKey, setOpenMenuKey] = useState<string | null>(null);

  // Customers are already filtered and sorted from the parent component
  const filtered = customers;

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
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Customers</h2>
            <p className="text-base text-gray-500">View and manage your customers</p>
          </div>
          {displayCount && (
            <div className="text-sm text-gray-500 font-medium">
              {displayCount.totalCount === 0 ? (
                'No customers found'
              ) : displayCount.startIndex === displayCount.endIndex ? (
                `Showing ${displayCount.startIndex} of ${displayCount.totalCount} customer${displayCount.totalCount !== 1 ? 's' : ''}`
              ) : (
                `Showing ${displayCount.startIndex}-${displayCount.endIndex} of ${displayCount.totalCount} customer${displayCount.totalCount !== 1 ? 's' : ''}`
              )}
            </div>
          )}
        </div>
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
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 cursor-pointer select-none" onClick={() => onSort?.('firstName')}>
                Name
                {sort.column === 'firstName' && (
                  sort.direction === 'asc' ? <ChevronUp /> : <ChevronDown />
                )}
              </th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 cursor-pointer select-none" onClick={() => onSort?.('phone')}>
                Phone
                {sort.column === 'phone' && (
                  sort.direction === 'asc' ? <ChevronUp /> : <ChevronDown />
                )}
              </th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 cursor-pointer select-none" onClick={() => onSort?.('email')}>
                Email
                {sort.column === 'email' && (
                  sort.direction === 'asc' ? <ChevronUp /> : <ChevronDown />
                )}
              </th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 cursor-pointer select-none" onClick={() => onSort?.('city')}>
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
  const [menuPosition, setMenuPosition] = useState<'top' | 'bottom'>('bottom');
  const isOpen = openMenuKey === menuKey;
  const autoCloseTimerRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (!isOpen) return;
    
    // Calculate menu position when opening
    const calculatePosition = () => {
      const element = document.querySelector(`[data-menu-key="${menuKey}"]`);
      if (element) {
        const rect = element.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const menuHeight = 200; // Approximate menu height
        const spaceBelow = viewportHeight - rect.bottom;
        const spaceAbove = rect.top;
        
        // If there's not enough space below but enough space above, open upward
        if (spaceBelow < menuHeight && spaceAbove > menuHeight) {
          setMenuPosition('top');
        } else {
          setMenuPosition('bottom');
        }
      }
    };
    
    calculatePosition();
    
    // Start auto-close timer (3 seconds)
    autoCloseTimerRef.current = setTimeout(() => {
      setOpenMenuKey(null);
    }, 3000);
    
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
      if (autoCloseTimerRef.current) {
        clearTimeout(autoCloseTimerRef.current);
      }
    };
  }, [isOpen, setOpenMenuKey, menuKey]);
  return (
    <div
      className={isCell ? 'absolute inset-0' : 'relative w-full h-full'}
      data-menu-key={menuKey}
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
        <div className={`absolute left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-xs px-3 py-1 rounded shadow-lg whitespace-nowrap pointer-events-none ${
          menuPosition === 'top' ? '-bottom-8' : '-top-8'
        }`}>
          More actions
        </div>
      )}
      {isOpen && (
        <Menu as="div" className={`absolute left-1/2 -translate-x-1/2 z-50 w-44 bg-white border border-gray-200 rounded-xl shadow-xl focus:outline-none py-2 ${
          menuPosition === 'top' 
            ? 'bottom-full mb-2 origin-bottom' 
            : 'top-full mt-2 origin-top'
        }`}>
          {actions.map((action, i) => (
            <Menu.Item key={i}>
              {({ active }) => (
                <button
                  className={`flex items-center gap-2 px-4 py-2 text-sm w-full text-left transition-all duration-200 ease-in-out transform hover:scale-[1.02] cursor-pointer ${
                    active 
                      ? 'bg-blue-50 text-blue-700 shadow-sm' 
                      : 'hover:bg-gray-50 hover:text-gray-700 hover:shadow-sm'
                  }`}
                  onClick={() => { 
                    if (autoCloseTimerRef.current) {
                      clearTimeout(autoCloseTimerRef.current);
                    }
                    setOpenMenuKey(null); 
                    action.onClick(); 
                  }}
                  onMouseEnter={() => {
                    // Reset timer when hovering over menu items
                    if (autoCloseTimerRef.current) {
                      clearTimeout(autoCloseTimerRef.current);
                    }
                    autoCloseTimerRef.current = setTimeout(() => {
                      setOpenMenuKey(null);
                    }, 3000);
                  }}
                  aria-label={action.label}
                >
                  <span className={`transition-transform duration-200 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
                    {action.icon}
                  </span>
                  <span className="font-medium">{action.label}</span>
                </button>
              )}
            </Menu.Item>
          ))}
        </Menu>
      )}
    </div>
  );
}