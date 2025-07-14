import React, { useState, useRef } from 'react';
import { IoCallOutline, IoCopyOutline, IoMailOutline, IoLocationOutline, IoEllipsisHorizontal, IoPencilOutline, IoTrashOutline } from 'react-icons/io5';
import { Menu } from '@headlessui/react';
import { toast } from 'react-hot-toast';
import SkeletonCard from './SkeletonCard';
import type { Customer } from '../types/customer';
import CustomerCardModal from './CustomerCardModal';
import { useCustomerContext } from '../app/tech/dashboard/customers/CustomerProvider';

interface CustomerCardListProps {
  customers: Customer[];
  openEditModal: (customer: Customer) => void;
  setShowDeleteConfirm: (b: boolean) => void;
  searchTerm?: string;
  highlightMatch?: (text: string | null | undefined, search: string) => React.ReactNode;
  isLoading?: boolean;
}

const CustomerCardList: React.FC<Omit<CustomerCardListProps, 'setSelectedCustomer'>> = ({ customers, openEditModal, setShowDeleteConfirm, searchTerm = '', highlightMatch, isLoading }) => {
  const { selectedCustomer, openCustomerModal, closeCustomerModal, fetchCustomers, setCustomers } = useCustomerContext();
  const [menuPositions, setMenuPositions] = useState<Record<string, 'top' | 'bottom'>>({});
  const autoCloseTimerRef = useRef<NodeJS.Timeout | null>(null);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {customers.map((customer) => {
        const address = [customer.address, customer.city, customer.state, customer.zipCode].filter(Boolean).join(', ');
        return (
          <div
            key={customer.id}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 md:p-5 flex flex-col gap-3 relative md:cursor-default md:pointer-events-none md:opacity-100 w-[calc(100vw-1rem)] max-w-full mx-[-0.5rem] md:mx-0 md:w-auto"
            tabIndex={0}
            role="button"
            aria-label={`Open actions for ${customer.firstName} ${customer.lastName}`}
            onClick={() => {
              if (window.innerWidth < 768) openCustomerModal(customer);
            }}
            onKeyDown={e => {
              if ((e.key === 'Enter' || e.key === ' ') && window.innerWidth < 768) {
                e.preventDefault();
                openCustomerModal(customer);
              }
            }}
          >
            {/* Top row: Avatar, Name, ... menu */}
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 min-w-[3.5rem] min-h-[3.5rem] rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl">
                  {customer.firstName?.[0]}{customer.lastName?.[0]}
                </div>
                <div>
                  <div className="font-bold text-lg text-gray-900">
                    {highlightMatch ? (
                      <>{highlightMatch(customer.firstName + ' ' + customer.lastName, searchTerm)}</>
                    ) : (
                      <>{customer.firstName} {customer.lastName}</>
                    )}
                  </div>
                  {/* City, State, Zip */}
                  {customer.city && customer.state && (
                    <div className="text-sm text-gray-600 mt-1">
                      {customer.city}, {customer.state} {customer.zipCode}
                    </div>
                  )}
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs text-gray-500 font-medium">Pianos</span>
                    <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 ml-1 min-w-[1.5em]">
                      {customer.pianos?.length || 0}
                    </span>
                  </div>
                </div>
              </div>
              <Menu as="div" className="relative">
                {({ open }) => {
                  // Calculate position when menu opens
                  React.useEffect(() => {
                    if (open) {
                      const button = document.querySelector(`[data-menu-button="${customer.id}"]`);
                      if (button) {
                        const rect = button.getBoundingClientRect();
                        const viewportHeight = window.innerHeight;
                        const menuHeight = 300; // Approximate menu height
                        const spaceBelow = viewportHeight - rect.bottom;
                        const spaceAbove = rect.top;
                        
                        // If there's not enough space below but enough space above, open upward
                        if (spaceBelow < menuHeight && spaceAbove > menuHeight) {
                          setMenuPositions(prev => ({ ...prev, [customer.id]: 'top' }));
                        } else {
                          setMenuPositions(prev => ({ ...prev, [customer.id]: 'bottom' }));
                        }
                      }
                      
                      // Start auto-close timer (3 seconds)
                      autoCloseTimerRef.current = setTimeout(() => {
                        // Close the menu by clicking outside
                        const event = new MouseEvent('mousedown', { bubbles: true });
                        document.dispatchEvent(event);
                      }, 3000);
                    } else {
                      // Clear timer when menu closes
                      if (autoCloseTimerRef.current) {
                        clearTimeout(autoCloseTimerRef.current);
                      }
                    }
                    
                    return () => {
                      if (autoCloseTimerRef.current) {
                        clearTimeout(autoCloseTimerRef.current);
                      }
                    };
                  }, [open, customer.id]);
                  
                  const menuPosition = menuPositions[customer.id] || 'bottom';
                  
                  return (
                    <>
                      <Menu.Button 
                        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        data-menu-button={customer.id}
                        onClick={e => e.stopPropagation()}
                      >
                        <IoEllipsisHorizontal className="w-6 h-6 text-gray-500" />
                      </Menu.Button>
                      <Menu.Items className={`absolute right-0 z-50 w-56 bg-white border border-gray-200 rounded-xl shadow-xl focus:outline-none py-2 group ${
                        menuPosition === 'top' 
                          ? 'bottom-full mb-2 origin-bottom-right' 
                          : 'top-full mt-2 origin-top-right'
                      }`}>
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href={`tel:${customer.phone}`}
                        className={`flex items-center gap-3 px-4 py-2 text-sm transition-all duration-200 ease-in-out transform hover:scale-[1.02] cursor-pointer ${
                          active 
                            ? 'bg-blue-50 text-blue-700 shadow-sm' 
                            : 'hover:bg-gray-50 hover:text-gray-700 hover:shadow-sm'
                        }`}
                        aria-label="Call"
                        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); } }}
                      >
                        <span className={`transition-transform duration-200 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
                          <IoCallOutline className="w-5 h-5 text-blue-500" />
                        </span>
                        <span className="font-medium">Call</span>
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`flex items-center gap-3 px-4 py-2 text-sm w-full transition-all duration-200 ease-in-out transform hover:scale-[1.02] cursor-pointer ${
                          active 
                            ? 'bg-blue-50 text-blue-700 shadow-sm' 
                            : 'hover:bg-gray-50 hover:text-gray-700 hover:shadow-sm'
                        }`}
                        onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(customer.phone); toast.success('Phone copied!'); }}
                        aria-label="Copy phone"
                        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigator.clipboard.writeText(customer.phone); } }}
                      >
                        <span className={`transition-transform duration-200 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
                          <IoCopyOutline className="w-5 h-5 text-blue-500" />
                        </span>
                        <span className="font-medium">Copy Phone</span>
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href={`mailto:${customer.email}`}
                        className={`flex items-center gap-3 px-4 py-2 text-sm transition-all duration-200 ease-in-out transform hover:scale-[1.02] cursor-pointer ${
                          active 
                            ? 'bg-blue-50 text-blue-700 shadow-sm' 
                            : 'hover:bg-gray-50 hover:text-gray-700 hover:shadow-sm'
                        }`}
                        aria-label="Email"
                        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); } }}
                      >
                        <span className={`transition-transform duration-200 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
                          <IoMailOutline className="w-5 h-5 text-blue-500" />
                        </span>
                        <span className="font-medium">Email</span>
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`flex items-center gap-3 px-4 py-2 text-sm w-full transition-all duration-200 ease-in-out transform hover:scale-[1.02] cursor-pointer ${
                          active 
                            ? 'bg-blue-50 text-blue-700 shadow-sm' 
                            : 'hover:bg-gray-50 hover:text-gray-700 hover:shadow-sm'
                        }`}
                        onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(customer.email || ''); toast.success('Email copied!'); }}
                        aria-label="Copy email"
                        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigator.clipboard.writeText(customer.email || ''); } }}
                      >
                        <span className={`transition-transform duration-200 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
                          <IoCopyOutline className="w-5 h-5 text-blue-500" />
                        </span>
                        <span className="font-medium">Copy Email</span>
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href={`https://www.google.com/maps/search/${encodeURIComponent(address)}`}
                        target="_blank"
                        rel="noreferrer"
                        className={`flex items-center gap-3 px-4 py-2 text-sm transition-all duration-200 ease-in-out transform hover:scale-[1.02] cursor-pointer ${
                          active 
                            ? 'bg-blue-50 text-blue-700 shadow-sm' 
                            : 'hover:bg-gray-50 hover:text-gray-700 hover:shadow-sm'
                        }`}
                        aria-label="View on map"
                        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); } }}
                      >
                        <span className={`transition-transform duration-200 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
                          <IoLocationOutline className="w-5 h-5 text-blue-500" />
                        </span>
                        <span className="font-medium">View on Map</span>
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`flex items-center gap-3 px-4 py-2 text-sm w-full transition-all duration-200 ease-in-out transform hover:scale-[1.02] cursor-pointer ${
                          active 
                            ? 'bg-blue-50 text-blue-700 shadow-sm' 
                            : 'hover:bg-gray-50 hover:text-gray-700 hover:shadow-sm'
                        }`}
                        onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(address); toast.success('Address copied!'); }}
                        aria-label="Copy address"
                        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigator.clipboard.writeText(address); } }}
                      >
                        <span className={`transition-transform duration-200 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
                          <IoCopyOutline className="w-5 h-5 text-blue-500" />
                        </span>
                        <span className="font-medium">Copy Address</span>
                      </button>
                    )}
                  </Menu.Item>
                  <div className="border-t border-gray-100 my-2" />
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`flex items-center gap-3 px-4 py-2 text-sm w-full transition-all duration-200 ease-in-out transform hover:scale-[1.02] cursor-pointer ${
                          active 
                            ? 'bg-blue-50 text-blue-700 shadow-sm' 
                            : 'hover:bg-gray-50 hover:text-gray-700 hover:shadow-sm'
                        }`}
                        onClick={(e) => { e.stopPropagation(); openEditModal(customer); }}
                        aria-label="Edit"
                        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openEditModal(customer); } }}
                      >
                        <span className={`transition-transform duration-200 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
                          <IoPencilOutline className="w-5 h-5 text-blue-500" />
                        </span>
                        <span className="font-medium">Edit</span>
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`flex items-center gap-3 px-4 py-2 text-sm w-full transition-all duration-200 ease-in-out transform hover:scale-[1.02] cursor-pointer ${
                          active 
                            ? 'bg-red-50 text-red-700 shadow-sm' 
                            : 'hover:bg-red-50 hover:text-red-700 hover:shadow-sm'
                        }`}
                        onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(true); }}
                        aria-label="Delete"
                        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setShowDeleteConfirm(true); } }}
                      >
                        <span className={`transition-transform duration-200 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
                          <IoTrashOutline className="w-5 h-5" />
                        </span>
                        <span className="font-medium">Delete</span>
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
                      </>
                    );
                  }}
                </Menu>
            </div>
            {/* Remove info section: phone, email, address */}
          </div>
        );
      })}
      {selectedCustomer && (
        <CustomerCardModal customer={selectedCustomer} onClose={closeCustomerModal} onEdit={openEditModal} />
      )}
    </div>
  );
};

export default CustomerCardList; 