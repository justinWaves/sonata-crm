import React, { useState } from 'react';
import { IoCallOutline, IoCopyOutline, IoMailOutline, IoLocationOutline, IoEllipsisHorizontal, IoPencilOutline, IoTrashOutline } from 'react-icons/io5';
import { Menu } from '@headlessui/react';
import SkeletonCard from './SkeletonCard';
import type { Customer } from '../types/customer';
import CustomerCardModal from './CustomerCardModal';
import { useCustomerContext } from '../providers/CustomerContext';

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
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 flex flex-col gap-3 relative md:cursor-default md:pointer-events-none md:opacity-100"
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
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 min-w-[3rem] min-h-[3rem] rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                  {customer.firstName?.[0]}{customer.lastName?.[0]}
                </div>
                <div className="font-bold text-xl text-gray-900">
                  {highlightMatch ? (
                    <>{highlightMatch(customer.firstName + ' ' + customer.lastName, searchTerm)}</>
                  ) : (
                    <>{customer.firstName} {customer.lastName}</>
                  )}
                </div>
              </div>
              <Menu as="div" className="relative">
                <Menu.Button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400">
                  <IoEllipsisHorizontal className="w-6 h-6 text-gray-500" />
                </Menu.Button>
                <Menu.Items className="absolute right-0 top-12 z-30 w-56 origin-top-right bg-white border border-gray-200 rounded-xl shadow-xl focus:outline-none py-2">
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href={`tel:${customer.phone}`}
                        className={`flex items-center gap-3 px-4 py-2 text-sm ${active ? 'bg-gray-100' : ''}`}
                        aria-label="Call"
                        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); } }}
                      >
                        <IoCallOutline className="w-5 h-5 text-blue-500" /> Call
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`flex items-center gap-3 px-4 py-2 text-sm w-full ${active ? 'bg-gray-100' : ''}`}
                        onClick={() => { navigator.clipboard.writeText(customer.phone); }}
                        aria-label="Copy phone"
                        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigator.clipboard.writeText(customer.phone); } }}
                      >
                        <IoCopyOutline className="w-5 h-5 text-blue-500" /> Copy Phone
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href={`mailto:${customer.email}`}
                        className={`flex items-center gap-3 px-4 py-2 text-sm ${active ? 'bg-gray-100' : ''}`}
                        aria-label="Email"
                        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); } }}
                      >
                        <IoMailOutline className="w-5 h-5 text-blue-500" /> Email
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`flex items-center gap-3 px-4 py-2 text-sm w-full ${active ? 'bg-gray-100' : ''}`}
                        onClick={() => { navigator.clipboard.writeText(customer.email || ''); }}
                        aria-label="Copy email"
                        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigator.clipboard.writeText(customer.email || ''); } }}
                      >
                        <IoCopyOutline className="w-5 h-5 text-blue-500" /> Copy Email
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href={`https://www.google.com/maps/search/${encodeURIComponent(address)}`}
                        target="_blank"
                        rel="noreferrer"
                        className={`flex items-center gap-3 px-4 py-2 text-sm ${active ? 'bg-gray-100' : ''}`}
                        aria-label="View on map"
                        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); } }}
                      >
                        <IoLocationOutline className="w-5 h-5 text-blue-500" /> View on Map
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`flex items-center gap-3 px-4 py-2 text-sm w-full ${active ? 'bg-gray-100' : ''}`}
                        onClick={() => { navigator.clipboard.writeText(address); }}
                        aria-label="Copy address"
                        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigator.clipboard.writeText(address); } }}
                      >
                        <IoCopyOutline className="w-5 h-5 text-blue-500" /> Copy Address
                      </button>
                    )}
                  </Menu.Item>
                  <div className="border-t border-gray-100 my-2" />
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`flex items-center gap-3 px-4 py-2 text-sm w-full ${active ? 'bg-gray-100' : ''}`}
                        onClick={() => openEditModal(customer)}
                        aria-label="Edit"
                        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openEditModal(customer); } }}
                      >
                        <IoPencilOutline className="w-5 h-5 text-blue-500" /> Edit
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`flex items-center gap-3 px-4 py-2 text-sm w-full text-red-600 ${active ? 'bg-gray-100' : ''}`}
                        onClick={() => { setShowDeleteConfirm(true); }}
                        aria-label="Delete"
                        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setShowDeleteConfirm(true); } }}
                      >
                        <IoTrashOutline className="w-5 h-5" /> Delete
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Menu>
            </div>
            {/* Info section: Phone, Email, Address with subtle icons */}
            <div className="flex flex-col gap-3 mt-1">
              <div className="flex items-center gap-2">
                <IoCallOutline className="w-5 h-5 text-blue-400" />
                <a
                  href={`tel:${customer.phone}`}
                  className="text-gray-900 font-medium text-base hover:text-blue-600 transition-colors focus:outline-none"
                  style={{ textDecoration: 'none' }}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); } }}
                >
                  {highlightMatch ? highlightMatch(customer.phone, searchTerm) : customer.phone}
                </a>
              </div>
              {customer.email && (
                <div className="flex items-center gap-2">
                  <IoMailOutline className="w-5 h-5 text-blue-400" />
                  <a
                    href={`mailto:${customer.email}`}
                    className="text-blue-700 font-medium text-sm hover:text-blue-900 transition-colors focus:outline-none"
                    style={{ textDecoration: 'none' }}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); } }}
                  >
                    {highlightMatch ? highlightMatch(customer.email, searchTerm) : customer.email}
                  </a>
                </div>
              )}
              {address && (
                <div className="flex items-center gap-2">
                  <IoLocationOutline className="w-5 h-5 text-gray-400" />
                  <a
                    href={`https://www.google.com/maps/search/${encodeURIComponent(address)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-gray-500 text-sm hover:text-blue-600 transition-colors focus:outline-none"
                    style={{ textDecoration: 'none' }}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); } }}
                  >
                    {highlightMatch ? highlightMatch(address, searchTerm) : address}
                  </a>
                </div>
              )}
            </div>
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