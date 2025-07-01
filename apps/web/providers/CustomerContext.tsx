import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Customer } from '../types/customer';

interface CustomerContextType {
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  selectedCustomer: Customer | null;
  setSelectedCustomer: React.Dispatch<React.SetStateAction<Customer | null>>;
  fetchCustomers: () => Promise<Customer[]>;
  openCustomerModal: (customer: Customer) => void;
  closeCustomerModal: () => void;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export const CustomerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const fetchCustomers = useCallback(async () => {
    const response = await fetch('/api/customers');
    const data = await response.json();
    setCustomers(data);
    return data;
  }, []);

  const openCustomerModal = (customer: Customer) => {
    setSelectedCustomer(customer);
  };
  const closeCustomerModal = () => {
    setSelectedCustomer(null);
  };

  return (
    <CustomerContext.Provider value={{
      customers,
      setCustomers,
      selectedCustomer,
      setSelectedCustomer,
      fetchCustomers,
      openCustomerModal,
      closeCustomerModal,
    }}>
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomerContext = () => {
  const ctx = useContext(CustomerContext);
  if (!ctx) throw new Error('useCustomerContext must be used within a CustomerProvider');
  return ctx;
}; 