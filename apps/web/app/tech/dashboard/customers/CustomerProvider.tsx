'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import type { Customer } from '../../../../types/customer'

interface CustomerContextType {
  customers: Customer[]
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>
  selectedCustomer: Customer | null
  setSelectedCustomer: React.Dispatch<React.SetStateAction<Customer | null>>
  fetchCustomers: () => Promise<Customer[]>
  openCustomerModal: (customer: Customer) => void
  closeCustomerModal: () => void
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined)

interface CustomerProviderProps {
  children: ReactNode
  customers: Customer[]
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>
  selectedCustomer: Customer | null
  setSelectedCustomer: React.Dispatch<React.SetStateAction<Customer | null>>
  fetchCustomers: () => Promise<Customer[]>
  openCustomerModal: (customer: Customer) => void
  closeCustomerModal: () => void
}

export const CustomerProvider: React.FC<CustomerProviderProps> = ({
  children,
  customers,
  setCustomers,
  selectedCustomer,
  setSelectedCustomer,
  fetchCustomers,
  openCustomerModal,
  closeCustomerModal,
}) => {
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
  )
}

export const useCustomerContext = () => {
  const ctx = useContext(CustomerContext)
  if (!ctx) throw new Error('useCustomerContext must be used within a CustomerProvider')
  return ctx
}