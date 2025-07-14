'use client'

import { useState, useEffect } from 'react'
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
import { AddCustomerModal } from '../../../../components/AddCustomerModal'

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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [sort, setSort] = useState<{ column: string; direction: 'asc' | 'desc' }>({ column: 'firstName', direction: 'asc' })

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

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
  const handleAddCustomer = async (customerData: Customer) => {
    try {
      // Add the new customer to the local state
      setCustomers(prev => [...prev, customerData])
      toast.success('Customer added successfully!')
      setIsAddModalOpen(false)
    } catch (error) {
      toast.error('Failed to add customer')
    }
  }
  const handleEditCustomer = async () => {}
  const handleDeleteCustomer = async () => {}
  
  // Stub state for compatibility
  const isModalOpen = false
  const setIsModalOpen = () => {}
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

  // Filter customers based on search term
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

  // Sort function
  const getSortValue = (c: Customer) => {
    switch (sort.column) {
      case 'firstName':
        return (c.firstName + ' ' + c.lastName).toLowerCase()
      case 'email':
        return (c.email || '').toLowerCase()
      case 'phone':
        return c.phone
      case 'city':
        return (c.city || '').toLowerCase()
      default:
        return ''
    }
  }

  // Sort filtered customers
  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    const aVal = getSortValue(a)
    const bVal = getSortValue(b)
    if (aVal < bVal) return sort.direction === 'asc' ? -1 : 1
    if (aVal > bVal) return sort.direction === 'asc' ? 1 : -1
    return 0
  })

  const totalPages = Math.ceil(sortedCustomers.length / pageSize)
  const paginatedCustomers = sortedCustomers.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  // Calculate display range for the indicator
  const startIndex = (currentPage - 1) * pageSize + 1
  const endIndex = Math.min(currentPage * pageSize, sortedCustomers.length)
  const totalCount = sortedCustomers.length

  // Handle sort changes
  const handleSort = (column: string) => {
    setSort((prev) =>
      prev.column === column
        ? { column, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { column, direction: 'asc' }
    )
    // Reset to first page when sorting changes
    setCurrentPage(1)
  }

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
            handleAddCustomer={async () => {}}
            handleEditCustomer={handleEditCustomer}
            handleDeleteCustomer={handleDeleteCustomer}
            openPianoModal={openPianoModal}
            closeModal={closeModal}
            openEditModal={openEditModal}
            searchTerm={searchTerm}
            highlightMatch={highlightMatch}
            sort={sort}
            onSort={handleSort}
            displayCount={{ startIndex, endIndex, totalCount }}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
        <div className="flex flex-col gap-2 md:hidden">
          {/* Mobile display count */}
          <div className="text-sm text-gray-400 font-medium text-center">
            {totalCount === 0 ? (
              'No customers found'
            ) : startIndex === endIndex ? (
              `Showing ${startIndex} of ${totalCount} customer${totalCount !== 1 ? 's' : ''}`
            ) : (
              `Showing ${startIndex}-${endIndex} of ${totalCount} customer${totalCount !== 1 ? 's' : ''}`
            )}
          </div>
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
        
        <AddCustomerModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleAddCustomer}
        />
      </CustomerTableProvider>
    </CustomerProvider>
  )
}