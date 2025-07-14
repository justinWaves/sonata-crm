'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect, use } from 'react'
import { AddCustomerModal } from '../../../../../../../components/AddCustomerModal'
import { updateCustomer, getCustomer } from '../../../../../../../lib/actions/customers'
import { toast } from 'react-hot-toast'
import type { Customer } from '../../../../../../../types/customer'
import SkeletonModal from '../../../../../../../components/SkeletonModal'

interface EditCustomerModalProps {
  params: Promise<{
    id: string
  }>
}

export default function EditCustomerModal({ params }: EditCustomerModalProps) {
  const router = useRouter()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)
  const resolvedParams = use(params)

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const customerData = await getCustomer(resolvedParams.id)
        setCustomer(customerData)
      } catch (error) {
        toast.error('Customer not found')
        router.back()
      } finally {
        setLoading(false)
      }
    }

    fetchCustomer()
  }, [resolvedParams.id, router])

  const handleClose = () => {
    router.back()
  }

  const handleSave = async (customerData: any) => {
    try {
      const formData = new FormData()
      
      Object.entries({ ...customerData, id: resolvedParams.id }).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, String(value))
        }
      })

      const result = await updateCustomer({}, formData)
      
      if (result.success) {
        toast.success('Customer updated!')
        router.back()
      } else {
        toast.error(result.error || 'Failed to update customer')
      }
    } catch (error) {
      toast.error('Failed to update customer')
    }
  }

  if (loading || !customer) {
    return <SkeletonModal />;
  }

  return (
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
        pianos: customer.pianos || [],
      }}
      editingCustomerId={customer.id}
    />
  )
}