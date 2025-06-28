'use client';

import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import Button from './Button';

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  email?: string;
}

interface CustomerSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExistingCustomerSelected: (customerId: string) => void;
  onNewCustomerRequested: () => void;
}

export const CustomerSelectionModal: React.FC<CustomerSelectionModalProps> = ({
  isOpen,
  onClose,
  onExistingCustomerSelected,
  onNewCustomerRequested,
}) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedCustomerId('');
      fetchCustomers();
    }
  }, [isOpen]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/customers');
      if (!response.ok) throw new Error('Failed to fetch customers');
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExistingCustomerContinue = () => {
    if (selectedCustomerId) {
      onExistingCustomerSelected(selectedCustomerId);
    }
  };

  const handleNewCustomer = () => {
    onNewCustomerRequested();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Select Customer" widthClass="max-w-lg">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Who is this appointment for?
          </h3>
          <p className="text-sm text-gray-500">
            Choose an existing customer or add a new one
          </p>
        </div>

        {/* Existing Customer Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Existing Customer
          </label>
          {loading ? (
            <div className="border border-gray-300 rounded-lg px-4 py-3 bg-gray-50">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ) : customers.length === 0 ? (
            <div className="border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 text-center">
              <p className="text-sm text-gray-500">No customers found</p>
            </div>
          ) : (
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Choose a customer...</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.firstName} {customer.lastName} - {customer.address}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">or</span>
          </div>
        </div>

        {/* New Customer Option */}
        <div className="text-center">
          <button
            type="button"
            onClick={handleNewCustomer}
            className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-blue-300 rounded-xl py-4 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
          >
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 mr-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </span>
            <span className="font-medium text-blue-700 text-base">Add New Customer</span>
          </button>
        </div>
      </div>

      <div className="flex justify-end space-x-4 mt-8">
        <Button
          variant="secondary"
          onClick={onClose}
          className="px-4 py-2 shadow-none border-none bg-transparent"
        >
          Cancel
        </Button>
        <Button
          onClick={handleExistingCustomerContinue}
          disabled={!selectedCustomerId}
          className="px-4 py-2"
        >
          Continue with Selected Customer
        </Button>
      </div>
    </Modal>
  );
}; 