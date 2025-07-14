'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { AddCustomerModal } from '../../../../../../components/AddCustomerModal'
import { updateCustomer } from '../../../../../../lib/actions/customers'
import { toast } from 'react-hot-toast'
import type { Customer } from '../../../../../../types/customer'

interface EditCustomerPageProps {
  customerId: string
}

export default function EditCustomerPage({ customerId }: EditCustomerPageProps) {
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

  const handleSave = async (customerData: any) => {
    try {
      const formData = new FormData()
      
      Object.entries({ ...customerData, id: customerId }).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, String(value))
        }
      })

      const result = await updateCustomer({}, formData)
      
      if (result.success) {
        toast.success('Customer updated!')
        router.push('/tech/dashboard/customers')
      } else {
        toast.error(result.error || 'Failed to update customer')
      }
    } catch (error) {
      toast.error('Failed to update customer')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading customer...</p>
        </div>
      </div>
    )
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
            <h1 className="text-2xl font-bold text-gray-900">Edit Customer</h1>
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
            <AddCustomerModal
              isOpen={true}
              onClose={handleClose}
              onSave={handleSave}
              initialValues={{
                firstName: customer.firstName || '',
                lastName: customer.lastName || '',
                companyName: customer.companyName || '',
                email: customer.email || '',
                phone: customer.phone || '',
                address: customer.address || '',
                city: customer.city || '',
                state: customer.state || '',
                zipCode: customer.zipCode || '',
                textUpdates: !!customer.textUpdates,
                emailUpdates: !!customer.emailUpdates,
              }}
              editingCustomerId={customer.id}
            />
          </div>
        </div>
      </div>
    </div>
  )
}