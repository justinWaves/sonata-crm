'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import CustomerCardModal from '../../../../../../components/CustomerCardModal'
import type { Customer } from '../../../../../../types/customer'

interface ViewCustomerPageProps {
  customerId: string
}

export default function ViewCustomerPage({ customerId }: ViewCustomerPageProps) {
  const router = useRouter()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await fetch(`/api/customers?id=${customerId}`)
        if (response.ok) {
          const customerData = await response.json()
          setCustomer(customerData)
        } else {
          toast.error('Customer not found')
          router.push('/tech/dashboard/customers')
        }
      } catch (error) {
        toast.error('Failed to fetch customer')
        router.push('/tech/dashboard/customers')
      } finally {
        setLoading(false)
      }
    }

    fetchCustomer()
  }, [customerId, router])

  const handleClose = () => {
    router.push('/tech/dashboard/customers')
  }

  const handleEdit = (customer: Customer) => {
    router.push(`/tech/dashboard/customers/edit/${customer.id}`)
  }

  if (loading) {
    return null; // Let the loading.tsx handle the skeleton
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Customer not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Customer Details</h1>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-6">
            <CustomerCardModal
              customer={customer}
              onClose={handleClose}
              onEdit={handleEdit}
            />
          </div>
        </div>
      </div>
    </div>
  )
}