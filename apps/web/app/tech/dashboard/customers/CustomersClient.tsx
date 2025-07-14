'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { CustomerTableProvider } from '../../../../components/CustomerTableContext'
import { CustomerProvider } from './CustomerProvider'
import SearchBar from '../../../../components/SearchBar'
import { CustomerTable } from '../../../../components/CustomerTable'
import BulkBar from '../../../../components/BulkBar'
import CustomerCardList from '../../../../components/CustomerCardList'
import Pagination from '../../../../components/Pagination'
import { highlightMatch } from '../../../../lib/utils'
import type { Customer } from '../../../../types/customer'

interface CustomersClientProps {
  initialCustomers: Customer[]
}

export default function CustomersClient({ initialCustomers }: CustomersClientProps) {
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers)
  const [loading, setLoading] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 15
  const [searchTerm, setSearchTerm] = useState('')

  // Simulate fetchCustomers for compatibility with BulkBar
  const fetchCustomers = async () => {
    return customers
  }

  const openCustomerModal = (customer: Customer) => {
    router.push(`/tech/dashboard/customers/view/${customer.id}`)
  }

  const openEditModal = (customer: Customer) => {
    router.push(`/tech/dashboard/customers/edit/${customer.id}`)
  }

  // Stub functions for compatibility with existing components
  const closeCustomerModal = () => setSelectedCustomer(null)
  const openPianoModal = (customer: Customer) => openCustomerModal(customer)
  const closeModal = () => setSelectedCustomer(null)
  const handleAddCustomer = async () => {}
  const handleEditCustomer = async () => {}
  const handleDeleteCustomer = async () => {}
  
  // Stub state for compatibility
  const isModalOpen = false
  const setIsModalOpen = () => {}
  const isAddModalOpen = false
  const setIsAddModalOpen = () => {}
  const isEditModalOpen = false
  const setIsEditModalOpen = () => {}
  const isAddPianoModalOpen = false
  const setIsAddPianoModalOpen = () => {}
  const isEditPianoModalOpen = false
  const setIsEditPianoModalOpen = () => {}
  const addForm = {}
  const setAddForm = () => {}
  const editForm = {}
  const setEditForm = () => {}
  const showDeleteConfirm = false
  const setShowDeleteConfirm = () => {}
  const deleting = false

  const filteredCustomers = customers.filter((customer) => {
    const term = searchTerm.toLowerCase()
    return (
      customer.firstName.toLowerCase().includes(term) ||
      customer.lastName.toLowerCase().includes(term) ||
      (customer.email?.toLowerCase() || '').includes(term) ||
      customer.phone.includes(term) ||
      customer.address.toLowerCase().includes(term) ||
      (customer.city?.toLowerCase() || '').includes(term) ||
      (customer.state?.toLowerCase() || '').includes(term) ||
      (customer.zipCode?.toLowerCase() || '').includes(term)
    )
  })
  const totalPages = Math.ceil(filteredCustomers.length / pageSize)
  const paginatedCustomers = filteredCustomers.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  return (
    <CustomerProvider
      customers={customers}
      setCustomers={setCustomers}
      selectedCustomer={selectedCustomer}
      setSelectedCustomer={setSelectedCustomer}
      fetchCustomers={fetchCustomers}
      openCustomerModal={openCustomerModal}
      closeCustomerModal={closeCustomerModal}
    >
      <CustomerTableProvider>
        <div
          className="fixed top-[56px] z-30 flex items-center justify-between px-8 py-4 bg-opacity-0 backdrop-blur-sm w-full left-0 md:left-[168px] md:w-[calc(100vw-168px)]"
          style={{ minWidth: 0 }}
        >
          <div className="max-w-md w-full">
            <SearchBar value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <button
            onClick={() => router.push('/tech/dashboard/customers/new')}
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
        </div>
      </CustomerTableProvider>
    </CustomerProvider>
  )
}